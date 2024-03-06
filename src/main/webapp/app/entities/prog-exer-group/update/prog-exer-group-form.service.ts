import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ProgExerGroup, NewProgExerGroup } from '../prog-exer-group.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ProgExerGroup for edit and NewProgExerGroupFormGroupInput for create.
 */
type ProgExerGroupFormGroupInput = ProgExerGroup | PartialWithRequiredKeyOf<NewProgExerGroup>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ProgExerGroup | NewProgExerGroup> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ProgExerGroupFormRawValue = FormValueOf<ProgExerGroup>;

type NewProgExerGroupFormRawValue = FormValueOf<NewProgExerGroup>;

type ProgExerGroupFormDefaults = Pick<NewProgExerGroup, 'id' | 'createdDate' | 'lastModifiedDate'>;

type ProgExerGroupFormGroupContent = {
  id: FormControl<ProgExerGroupFormRawValue['id'] | NewProgExerGroup['id']>;
  exerGroupId: FormControl<ProgExerGroupFormRawValue['exerGroupId']>;
  progId: FormControl<ProgExerGroupFormRawValue['progId']>;
  createdBy: FormControl<ProgExerGroupFormRawValue['createdBy']>;
  createdDate: FormControl<ProgExerGroupFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ProgExerGroupFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ProgExerGroupFormRawValue['lastModifiedDate']>;
};

export type ProgExerGroupFormGroup = FormGroup<ProgExerGroupFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProgExerGroupFormService {
  createProgExerGroupFormGroup(progExerGroup: ProgExerGroupFormGroupInput = { id: null }): ProgExerGroupFormGroup {
    const progExerGroupRawValue = this.convertProgExerGroupToProgExerGroupRawValue({
      ...this.getFormDefaults(),
      ...progExerGroup,
    });
    return new FormGroup<ProgExerGroupFormGroupContent>({
      id: new FormControl(
        { value: progExerGroupRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      exerGroupId: new FormControl(progExerGroupRawValue.exerGroupId),
      progId: new FormControl(progExerGroupRawValue.progId),
      createdBy: new FormControl(progExerGroupRawValue.createdBy),
      createdDate: new FormControl(progExerGroupRawValue.createdDate),
      lastModifiedBy: new FormControl(progExerGroupRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(progExerGroupRawValue.lastModifiedDate),
    });
  }

  getProgExerGroup(form: ProgExerGroupFormGroup): ProgExerGroup | NewProgExerGroup {
    return this.convertProgExerGroupRawValueToProgExerGroup(form.getRawValue() as ProgExerGroupFormRawValue | NewProgExerGroupFormRawValue);
  }

  resetForm(form: ProgExerGroupFormGroup, progExerGroup: ProgExerGroupFormGroupInput): void {
    const progExerGroupRawValue = this.convertProgExerGroupToProgExerGroupRawValue({ ...this.getFormDefaults(), ...progExerGroup });
    form.reset(
      {
        ...progExerGroupRawValue,
        id: { value: progExerGroupRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProgExerGroupFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertProgExerGroupRawValueToProgExerGroup(
    rawProgExerGroup: ProgExerGroupFormRawValue | NewProgExerGroupFormRawValue,
  ): ProgExerGroup | NewProgExerGroup {
    return {
      ...rawProgExerGroup,
      createdDate: dayjs(rawProgExerGroup.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawProgExerGroup.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertProgExerGroupToProgExerGroupRawValue(
    progExerGroup: ProgExerGroup | (Partial<NewProgExerGroup> & ProgExerGroupFormDefaults),
  ): ProgExerGroupFormRawValue | PartialWithRequiredKeyOf<NewProgExerGroupFormRawValue> {
    return {
      ...progExerGroup,
      createdDate: progExerGroup.createdDate ? progExerGroup.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: progExerGroup.lastModifiedDate ? progExerGroup.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
