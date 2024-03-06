import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CommonServiceCode, NewCommonServiceCode } from '../common-service-code.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts CommonServiceCode for edit and NewCommonServiceCodeFormGroupInput for create.
 */
type CommonServiceCodeFormGroupInput = CommonServiceCode | PartialWithRequiredKeyOf<NewCommonServiceCode>;

type CommonServiceCodeFormDefaults = Pick<NewCommonServiceCode, 'id'>;

type CommonServiceCodeFormGroupContent = {
  id: FormControl<CommonServiceCode['id'] | NewCommonServiceCode['id']>;
  serviceCode: FormControl<CommonServiceCode['serviceCode']>;
  description: FormControl<CommonServiceCode['description']>;
  serviceType: FormControl<CommonServiceCode['serviceType']>;
  category: FormControl<CommonServiceCode['category']>;
  note: FormControl<CommonServiceCode['note']>;
};

export type CommonServiceCodeFormGroup = FormGroup<CommonServiceCodeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CommonServiceCodeFormService {
  createCommonServiceCodeFormGroup(commonServiceCode: CommonServiceCodeFormGroupInput = { id: null }): CommonServiceCodeFormGroup {
    const commonServiceCodeRawValue = {
      ...this.getFormDefaults(),
      ...commonServiceCode,
    };
    return new FormGroup<CommonServiceCodeFormGroupContent>({
      id: new FormControl(
        { value: commonServiceCodeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      serviceCode: new FormControl(commonServiceCodeRawValue.serviceCode, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(15)],
      }),
      description: new FormControl(commonServiceCodeRawValue.description, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(350)],
      }),
      serviceType: new FormControl(commonServiceCodeRawValue.serviceType),
      category: new FormControl(commonServiceCodeRawValue.category, {
        validators: [Validators.maxLength(15)],
      }),
      note: new FormControl(commonServiceCodeRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
    });
  }

  getCommonServiceCode(form: CommonServiceCodeFormGroup): CommonServiceCode | NewCommonServiceCode {
    return form.getRawValue() as CommonServiceCode | NewCommonServiceCode;
  }

  resetForm(form: CommonServiceCodeFormGroup, commonServiceCode: CommonServiceCodeFormGroupInput): void {
    const commonServiceCodeRawValue = { ...this.getFormDefaults(), ...commonServiceCode };
    form.reset(
      {
        ...commonServiceCodeRawValue,
        id: { value: commonServiceCodeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CommonServiceCodeFormDefaults {
    return {
      id: null,
    };
  }
}
