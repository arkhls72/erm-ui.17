import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Medical, NewMedical } from '../medical.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Medical for edit and NewMedicalFormGroupInput for create.
 */
type MedicalFormGroupInput = Medical | PartialWithRequiredKeyOf<NewMedical>;

type MedicalFormDefaults = Pick<NewMedical, 'id'>;

type MedicalFormGroupContent = {
  id: FormControl<Medical['id'] | NewMedical['id']>;
  clientId: FormControl<Medical['clientId']>;
  injuryId: FormControl<Medical['injuryId']>;
  medicationId: FormControl<Medical['medicationId']>;
  conditionId: FormControl<Medical['conditionId']>;
  operationId: FormControl<Medical['operationId']>;
};

export type MedicalFormGroup = FormGroup<MedicalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MedicalFormService {
  createMedicalFormGroup(medical: MedicalFormGroupInput = { id: null }): MedicalFormGroup {
    const medicalRawValue = {
      ...this.getFormDefaults(),
      ...medical,
    };
    return new FormGroup<MedicalFormGroupContent>({
      id: new FormControl(
        { value: medicalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      clientId: new FormControl(medicalRawValue.clientId, {
        validators: [Validators.required],
      }),
      injuryId: new FormControl(medicalRawValue.injuryId),
      medicationId: new FormControl(medicalRawValue.medicationId),
      conditionId: new FormControl(medicalRawValue.conditionId),
      operationId: new FormControl(medicalRawValue.operationId),
    });
  }

  getMedical(form: MedicalFormGroup): Medical | NewMedical {
    return form.getRawValue() as Medical | NewMedical;
  }

  resetForm(form: MedicalFormGroup, medical: MedicalFormGroupInput): void {
    const medicalRawValue = { ...this.getFormDefaults(), ...medical };
    form.reset(
      {
        ...medicalRawValue,
        id: { value: medicalRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MedicalFormDefaults {
    return {
      id: null,
    };
  }
}
