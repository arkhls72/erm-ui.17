import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Muscle, NewMuscle } from '../muscle.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Muscle for edit and NewMuscleFormGroupInput for create.
 */
type MuscleFormGroupInput = Muscle | PartialWithRequiredKeyOf<NewMuscle>;

type MuscleFormDefaults = Pick<NewMuscle, 'id'>;

type MuscleFormGroupContent = {
  id: FormControl<Muscle['id'] | NewMuscle['id']>;
  name: FormControl<Muscle['name']>;
};

export type MuscleFormGroup = FormGroup<MuscleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MuscleFormService {
  createMuscleFormGroup(muscle: MuscleFormGroupInput = { id: null }): MuscleFormGroup {
    const muscleRawValue = {
      ...this.getFormDefaults(),
      ...muscle,
    };
    return new FormGroup<MuscleFormGroupContent>({
      id: new FormControl(
        { value: muscleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(muscleRawValue.name, {
        validators: [Validators.required],
      }),
    });
  }

  getMuscle(form: MuscleFormGroup): Muscle | NewMuscle {
    return form.getRawValue() as Muscle | NewMuscle;
  }

  resetForm(form: MuscleFormGroup, muscle: MuscleFormGroupInput): void {
    const muscleRawValue = { ...this.getFormDefaults(), ...muscle };
    form.reset(
      {
        ...muscleRawValue,
        id: { value: muscleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MuscleFormDefaults {
    return {
      id: null,
    };
  }
}
