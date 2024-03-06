import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ExerciseLevel, NewExerciseLevel } from '../exercise-level.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ExerciseLevel for edit and NewExerciseLevelFormGroupInput for create.
 */
type ExerciseLevelFormGroupInput = ExerciseLevel | PartialWithRequiredKeyOf<NewExerciseLevel>;

type ExerciseLevelFormDefaults = Pick<NewExerciseLevel, 'id'>;

type ExerciseLevelFormGroupContent = {
  id: FormControl<ExerciseLevel['id'] | NewExerciseLevel['id']>;
  name: FormControl<ExerciseLevel['name']>;
};

export type ExerciseLevelFormGroup = FormGroup<ExerciseLevelFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExerciseLevelFormService {
  createExerciseLevelFormGroup(exerciseLevel: ExerciseLevelFormGroupInput = { id: null }): ExerciseLevelFormGroup {
    const exerciseLevelRawValue = {
      ...this.getFormDefaults(),
      ...exerciseLevel,
    };
    return new FormGroup<ExerciseLevelFormGroupContent>({
      id: new FormControl(
        { value: exerciseLevelRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(exerciseLevelRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
    });
  }

  getExerciseLevel(form: ExerciseLevelFormGroup): ExerciseLevel | NewExerciseLevel {
    return form.getRawValue() as ExerciseLevel | NewExerciseLevel;
  }

  resetForm(form: ExerciseLevelFormGroup, exerciseLevel: ExerciseLevelFormGroupInput): void {
    const exerciseLevelRawValue = { ...this.getFormDefaults(), ...exerciseLevel };
    form.reset(
      {
        ...exerciseLevelRawValue,
        id: { value: exerciseLevelRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ExerciseLevelFormDefaults {
    return {
      id: null,
    };
  }
}
