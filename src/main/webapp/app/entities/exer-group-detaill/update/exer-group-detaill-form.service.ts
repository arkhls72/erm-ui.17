import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ExerGroupDetaill, NewExerGroupDetaill } from '../exer-group-detaill.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ExerGroupDetaill for edit and NewExerGroupDetaillFormGroupInput for create.
 */
type ExerGroupDetaillFormGroupInput = ExerGroupDetaill | PartialWithRequiredKeyOf<NewExerGroupDetaill>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ExerGroupDetaill | NewExerGroupDetaill> = Omit<T, 'lastModifiedDate' | 'createdDate'> & {
  lastModifiedDate?: string | null;
  createdDate?: string | null;
};

type ExerGroupDetaillFormRawValue = FormValueOf<ExerGroupDetaill>;

type NewExerGroupDetaillFormRawValue = FormValueOf<NewExerGroupDetaill>;

type ExerGroupDetaillFormDefaults = Pick<NewExerGroupDetaill, 'id' | 'lastModifiedDate' | 'createdDate'>;

type ExerGroupDetaillFormGroupContent = {
  id: FormControl<ExerGroupDetaillFormRawValue['id'] | NewExerGroupDetaill['id']>;
  exerGroupId: FormControl<ExerGroupDetaillFormRawValue['exerGroupId']>;
  exerciseId: FormControl<ExerGroupDetaillFormRawValue['exercise']>;
  lastModifiedBy: FormControl<ExerGroupDetaillFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ExerGroupDetaillFormRawValue['lastModifiedDate']>;
  createdDate: FormControl<ExerGroupDetaillFormRawValue['createdDate']>;
  createdBy: FormControl<ExerGroupDetaillFormRawValue['createdBy']>;
};

export type ExerGroupDetaillFormGroup = FormGroup<ExerGroupDetaillFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExerGroupDetaillFormService {
  createExerGroupDetaillFormGroup(exerGroupDetaill: ExerGroupDetaillFormGroupInput = { id: null }): ExerGroupDetaillFormGroup {
    const exerGroupDetaillRawValue = this.convertExerGroupDetaillToExerGroupDetaillRawValue({
      ...this.getFormDefaults(),
      ...exerGroupDetaill,
    });
    return new FormGroup<ExerGroupDetaillFormGroupContent>({
      id: new FormControl(
        { value: exerGroupDetaillRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      exerGroupId: new FormControl(exerGroupDetaillRawValue.exerGroupId, {
        validators: [Validators.required],
      }),
      exerciseId: new FormControl(exerGroupDetaillRawValue.exercise, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(exerGroupDetaillRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(exerGroupDetaillRawValue.lastModifiedDate),
      createdDate: new FormControl(exerGroupDetaillRawValue.createdDate),
      createdBy: new FormControl(exerGroupDetaillRawValue.createdBy),
    });
  }

  getExerGroupDetaill(form: ExerGroupDetaillFormGroup): ExerGroupDetaill | NewExerGroupDetaill {
    return this.convertExerGroupDetaillRawValueToExerGroupDetaill(
      form.getRawValue() as ExerGroupDetaillFormRawValue | NewExerGroupDetaillFormRawValue,
    );
  }

  resetForm(form: ExerGroupDetaillFormGroup, exerGroupDetaill: ExerGroupDetaillFormGroupInput): void {
    const exerGroupDetaillRawValue = this.convertExerGroupDetaillToExerGroupDetaillRawValue({
      ...this.getFormDefaults(),
      ...exerGroupDetaill,
    });
    form.reset(
      {
        ...exerGroupDetaillRawValue,
        id: { value: exerGroupDetaillRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ExerGroupDetaillFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      lastModifiedDate: currentTime,
      createdDate: currentTime,
    };
  }

  private convertExerGroupDetaillRawValueToExerGroupDetaill(
    rawExerGroupDetaill: ExerGroupDetaillFormRawValue | NewExerGroupDetaillFormRawValue,
  ): ExerGroupDetaill | NewExerGroupDetaill {
    return {
      ...rawExerGroupDetaill,
      lastModifiedDate: dayjs(rawExerGroupDetaill.lastModifiedDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawExerGroupDetaill.createdDate, DATE_TIME_FORMAT),
    };
  }

  private convertExerGroupDetaillToExerGroupDetaillRawValue(
    exerGroupDetaill: ExerGroupDetaill | (Partial<NewExerGroupDetaill> & ExerGroupDetaillFormDefaults),
  ): ExerGroupDetaillFormRawValue | PartialWithRequiredKeyOf<NewExerGroupDetaillFormRawValue> {
    return {
      ...exerGroupDetaill,
      lastModifiedDate: exerGroupDetaill.lastModifiedDate ? exerGroupDetaill.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: exerGroupDetaill.createdDate ? exerGroupDetaill.createdDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
