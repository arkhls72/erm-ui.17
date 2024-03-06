import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ExerGroup, NewExerGroup } from '../exer-group.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ExerGroup for edit and NewExerGroupFormGroupInput for create.
 */
type ExerGroupFormGroupInput = ExerGroup | PartialWithRequiredKeyOf<NewExerGroup>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ExerGroup | NewExerGroup> = Omit<T, 'lastModifiedDate' | 'createdDate'> & {
  lastModifiedDate?: string | null;
  createdDate?: string | null;
};

type ExerGroupFormRawValue = FormValueOf<ExerGroup>;

type NewExerGroupFormRawValue = FormValueOf<NewExerGroup>;

type ExerGroupFormDefaults = Pick<NewExerGroup, 'id' | 'lastModifiedDate' | 'createdDate'>;

type ExerGroupFormGroupContent = {
  id: FormControl<ExerGroupFormRawValue['id'] | NewExerGroup['id']>;
  name: FormControl<ExerGroupFormRawValue['name']>;
  description: FormControl<ExerGroupFormRawValue['description']>;
  lastModifiedDate: FormControl<ExerGroupFormRawValue['lastModifiedDate']>;
  lastModifiedBy: FormControl<ExerGroupFormRawValue['lastModifiedBy']>;
  createdDate: FormControl<ExerGroupFormRawValue['createdDate']>;
  createdBy: FormControl<ExerGroupFormRawValue['createdBy']>;
};

export type ExerGroupFormGroup = FormGroup<ExerGroupFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExerGroupFormService {
  createExerGroupFormGroup(exerGroup: ExerGroupFormGroupInput = { id: null }): ExerGroupFormGroup {
    const exerGroupRawValue = this.convertExerGroupToExerGroupRawValue({
      ...this.getFormDefaults(),
      ...exerGroup,
    });
    return new FormGroup<ExerGroupFormGroupContent>({
      id: new FormControl(
        { value: exerGroupRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(exerGroupRawValue.name, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      description: new FormControl(exerGroupRawValue.description),
      lastModifiedDate: new FormControl(exerGroupRawValue.lastModifiedDate),
      lastModifiedBy: new FormControl(exerGroupRawValue.lastModifiedBy),
      createdDate: new FormControl(exerGroupRawValue.createdDate),
      createdBy: new FormControl(exerGroupRawValue.createdBy),
    });
  }

  getExerGroup(form: ExerGroupFormGroup): ExerGroup | NewExerGroup {
    return this.convertExerGroupRawValueToExerGroup(form.getRawValue() as ExerGroupFormRawValue | NewExerGroupFormRawValue);
  }

  resetForm(form: ExerGroupFormGroup, exerGroup: ExerGroupFormGroupInput): void {
    const exerGroupRawValue = this.convertExerGroupToExerGroupRawValue({ ...this.getFormDefaults(), ...exerGroup });
    form.reset(
      {
        ...exerGroupRawValue,
        id: { value: exerGroupRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ExerGroupFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      lastModifiedDate: currentTime,
      createdDate: currentTime,
    };
  }

  private convertExerGroupRawValueToExerGroup(rawExerGroup: ExerGroupFormRawValue | NewExerGroupFormRawValue): ExerGroup | NewExerGroup {
    return {
      ...rawExerGroup,
      lastModifiedDate: dayjs(rawExerGroup.lastModifiedDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawExerGroup.createdDate, DATE_TIME_FORMAT),
    };
  }

  private convertExerGroupToExerGroupRawValue(
    exerGroup: ExerGroup | (Partial<NewExerGroup> & ExerGroupFormDefaults),
  ): ExerGroupFormRawValue | PartialWithRequiredKeyOf<NewExerGroupFormRawValue> {
    return {
      ...exerGroup,
      lastModifiedDate: exerGroup.lastModifiedDate ? exerGroup.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: exerGroup.createdDate ? exerGroup.createdDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
