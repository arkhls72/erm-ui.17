import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Insurance, NewInsurance } from '../insurance.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Insurance for edit and NewInsuranceFormGroupInput for create.
 */
type InsuranceFormGroupInput = Insurance | PartialWithRequiredKeyOf<NewInsurance>;

type InsuranceFormDefaults = Pick<NewInsurance, 'id'>;

type InsuranceFormGroupContent = {
  id: FormControl<Insurance['id'] | NewInsurance['id']>;
  clientId: FormControl<Insurance['clientId']>;
  ehcId: FormControl<Insurance['ehcId']>;
  coveragerId: FormControl<Insurance['coveragerId']>;
  mvaId: FormControl<Insurance['mvaId']>;
  wsibId: FormControl<Insurance['wsibId']>;
};

export type InsuranceFormGroup = FormGroup<InsuranceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InsuranceFormService {
  createInsuranceFormGroup(insurance: InsuranceFormGroupInput = { id: null }): InsuranceFormGroup {
    const insuranceRawValue = {
      ...this.getFormDefaults(),
      ...insurance,
    };
    return new FormGroup<InsuranceFormGroupContent>({
      id: new FormControl(
        { value: insuranceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      clientId: new FormControl(insuranceRawValue.clientId, {
        validators: [Validators.required],
      }),
      ehcId: new FormControl(insuranceRawValue.ehcId),
      coveragerId: new FormControl(insuranceRawValue.coveragerId),
      mvaId: new FormControl(insuranceRawValue.mvaId),
      wsibId: new FormControl(insuranceRawValue.wsibId),
    });
  }

  getInsurance(form: InsuranceFormGroup): Insurance | NewInsurance {
    return form.getRawValue() as Insurance | NewInsurance;
  }

  resetForm(form: InsuranceFormGroup, insurance: InsuranceFormGroupInput): void {
    const insuranceRawValue = { ...this.getFormDefaults(), ...insurance };
    form.reset(
      {
        ...insuranceRawValue,
        id: { value: insuranceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InsuranceFormDefaults {
    return {
      id: null,
    };
  }
}
