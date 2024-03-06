import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { FeeType, NewFeeType } from '../fee-type.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts FeeType for edit and NewFeeTypeFormGroupInput for create.
 */
type FeeTypeFormGroupInput = FeeType | PartialWithRequiredKeyOf<NewFeeType>;

type FeeTypeFormDefaults = Pick<NewFeeType, 'id'>;

type FeeTypeFormGroupContent = {
  id: FormControl<FeeType['id'] | NewFeeType['id']>;
  name: FormControl<FeeType['name']>;
};

export type FeeTypeFormGroup = FormGroup<FeeTypeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FeeTypeFormService {
  createFeeTypeFormGroup(feeType: FeeTypeFormGroupInput = { id: null }): FeeTypeFormGroup {
    const feeTypeRawValue = {
      ...this.getFormDefaults(),
      ...feeType,
    };
    return new FormGroup<FeeTypeFormGroupContent>({
      id: new FormControl(
        { value: feeTypeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(feeTypeRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
    });
  }

  getFeeType(form: FeeTypeFormGroup): FeeType | NewFeeType {
    return form.getRawValue() as FeeType | NewFeeType;
  }

  resetForm(form: FeeTypeFormGroup, feeType: FeeTypeFormGroupInput): void {
    const feeTypeRawValue = { ...this.getFormDefaults(), ...feeType };
    form.reset(
      {
        ...feeTypeRawValue,
        id: { value: feeTypeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): FeeTypeFormDefaults {
    return {
      id: null,
    };
  }
}
