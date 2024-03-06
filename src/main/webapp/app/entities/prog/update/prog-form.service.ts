import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Prog, NewProg } from '../prog.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Prog for edit and NewProgFormGroupInput for create.
 */
type ProgFormGroupInput = Prog | PartialWithRequiredKeyOf<NewProg>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Prog | NewProg> = Omit<T, 'startDate' | 'endDate' | 'createdDate' | 'createdBy' | 'lastModifiedDate'> & {
  startDate?: string | null;
  endDate?: string | null;
  createdDate?: string | null;
  createdBy?: string | null;
  lastModifiedDate?: string | null;
};

type ProgFormRawValue = FormValueOf<Prog>;

type NewProgFormRawValue = FormValueOf<NewProg>;

type ProgFormDefaults = Pick<NewProg, 'id' | 'startDate' | 'endDate' | 'createdDate' | 'createdBy' | 'lastModifiedDate'>;

type ProgFormGroupContent = {
  id: FormControl<ProgFormRawValue['id'] | NewProg['id']>;
  name: FormControl<ProgFormRawValue['name']>;
  status: FormControl<ProgFormRawValue['status']>;
  clientId: FormControl<ProgFormRawValue['clientId']>;
  startDate: FormControl<ProgFormRawValue['startDate']>;
  endDate: FormControl<ProgFormRawValue['endDate']>;
  clinicalNote: FormControl<ProgFormRawValue['clinicalNote']>;
  assessmentId: FormControl<ProgFormRawValue['assessmentId']>;
  createdDate: FormControl<ProgFormRawValue['createdDate']>;
  createdBy: FormControl<ProgFormRawValue['createdBy']>;
  lastModifiedBy: FormControl<ProgFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ProgFormRawValue['lastModifiedDate']>;
};

export type ProgFormGroup = FormGroup<ProgFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProgFormService {
  createProgFormGroup(prog: ProgFormGroupInput = { id: null }): ProgFormGroup {
    const progRawValue = this.convertProgToProgRawValue({
      ...this.getFormDefaults(),
      ...prog,
    });
    return new FormGroup<ProgFormGroupContent>({
      id: new FormControl(
        { value: progRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(progRawValue.name, {
        validators: [Validators.maxLength(50)],
      }),
      status: new FormControl(progRawValue.status, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      clientId: new FormControl(progRawValue.clientId, {
        validators: [Validators.required],
      }),
      startDate: new FormControl(progRawValue.startDate, {
        validators: [Validators.required],
      }),
      endDate: new FormControl(progRawValue.endDate),
      clinicalNote: new FormControl(progRawValue.clinicalNote),
      assessmentId: new FormControl(progRawValue.assessmentId, {
        validators: [Validators.required],
      }),
      createdDate: new FormControl(progRawValue.createdDate),
      createdBy: new FormControl(progRawValue.createdBy),
      lastModifiedBy: new FormControl(progRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(progRawValue.lastModifiedDate),
    });
  }

  getProg(form: ProgFormGroup): Prog | NewProg {
    return this.convertProgRawValueToProg(form.getRawValue() as ProgFormRawValue | NewProgFormRawValue);
  }

  resetForm(form: ProgFormGroup, prog: ProgFormGroupInput): void {
    const progRawValue = this.convertProgToProgRawValue({ ...this.getFormDefaults(), ...prog });
    form.reset(
      {
        ...progRawValue,
        id: { value: progRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProgFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      endDate: currentTime,
      createdDate: currentTime,
      createdBy: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertProgRawValueToProg(rawProg: ProgFormRawValue | NewProgFormRawValue): Prog | NewProg {
    return {
      ...rawProg,
      startDate: dayjs(rawProg.startDate, DATE_TIME_FORMAT),
      endDate: dayjs(rawProg.endDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawProg.createdDate, DATE_TIME_FORMAT),
      createdBy: dayjs(rawProg.createdBy, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawProg.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertProgToProgRawValue(
    prog: Prog | (Partial<NewProg> & ProgFormDefaults),
  ): ProgFormRawValue | PartialWithRequiredKeyOf<NewProgFormRawValue> {
    return {
      ...prog,
      startDate: prog.startDate ? prog.startDate.format(DATE_TIME_FORMAT) : undefined,
      endDate: prog.endDate ? prog.endDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: prog.createdDate ? prog.createdDate.format(DATE_TIME_FORMAT) : undefined,
      createdBy: prog.createdBy ? prog.createdBy.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: prog.lastModifiedDate ? prog.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
