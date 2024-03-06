import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Therapy, NewTherapy } from '../therapy.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Therapy for edit and NewTherapyFormGroupInput for create.
 */
type TherapyFormGroupInput = Therapy | PartialWithRequiredKeyOf<NewTherapy>;

type TherapyFormDefaults = Pick<NewTherapy, 'id'>;

type TherapyFormGroupContent = {
  id: FormControl<Therapy['id'] | NewTherapy['id']>;
  name: FormControl<Therapy['name']>;
};

export type TherapyFormGroup = FormGroup<TherapyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TherapyFormService {
  createTherapyFormGroup(therapy: TherapyFormGroupInput = { id: null }): TherapyFormGroup {
    const therapyRawValue = {
      ...this.getFormDefaults(),
      ...therapy,
    };
    return new FormGroup<TherapyFormGroupContent>(<TherapyFormGroupContent>{
      id: new FormControl(
        { value: therapyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(therapyRawValue.name, {
        validators: [Validators.required],
      }),
    });
  }

  getTherapy(form: TherapyFormGroup): Therapy | NewTherapy {
    return form.getRawValue() as Therapy | NewTherapy;
  }

  resetForm(form: TherapyFormGroup, therapy: TherapyFormGroupInput): void {
    const therapyRawValue = { ...this.getFormDefaults(), ...therapy };
    form.reset(
      {
        ...therapyRawValue,
        id: { value: therapyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TherapyFormDefaults {
    return {
      id: null,
    };
  }
}
