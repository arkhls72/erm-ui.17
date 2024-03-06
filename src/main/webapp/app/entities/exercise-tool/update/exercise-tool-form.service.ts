import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ExerciseTool, NewExerciseTool } from '../exercise-tool.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ExerciseTool for edit and NewExerciseToolFormGroupInput for create.
 */
type ExerciseToolFormGroupInput = ExerciseTool | PartialWithRequiredKeyOf<NewExerciseTool>;

type ExerciseToolFormDefaults = Pick<NewExerciseTool, 'id'>;

type ExerciseToolFormGroupContent = {
  id: FormControl<ExerciseTool['id'] | NewExerciseTool['id']>;
  name: FormControl<ExerciseTool['name']>;
};

export type ExerciseToolFormGroup = FormGroup<ExerciseToolFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExerciseToolFormService {
  createExerciseToolFormGroup(exerciseTool: ExerciseToolFormGroupInput = { id: null }): ExerciseToolFormGroup {
    const exerciseToolRawValue = {
      ...this.getFormDefaults(),
      ...exerciseTool,
    };
    return new FormGroup<ExerciseToolFormGroupContent>({
      id: new FormControl(
        { value: exerciseToolRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(exerciseToolRawValue.name, {
        validators: [Validators.required],
      }),
    });
  }

  getExerciseTool(form: ExerciseToolFormGroup): ExerciseTool | NewExerciseTool {
    return form.getRawValue() as ExerciseTool | NewExerciseTool;
  }

  resetForm(form: ExerciseToolFormGroup, exerciseTool: ExerciseToolFormGroupInput): void {
    const exerciseToolRawValue = { ...this.getFormDefaults(), ...exerciseTool };
    form.reset(
      {
        ...exerciseToolRawValue,
        id: { value: exerciseToolRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ExerciseToolFormDefaults {
    return {
      id: null,
    };
  }
}
