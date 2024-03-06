import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Exercise, NewExercise } from '../exercise.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Exercise for edit and NewExerciseFormGroupInput for create.
 */
type ExerciseFormGroupInput = Exercise | PartialWithRequiredKeyOf<NewExercise>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Exercise | NewExercise> = Omit<T, 'lastModifiedDate' | 'createdDate'> & {
  lastModifiedDate?: string | null;
  createdDate?: string | null;
};

type ExerciseFormRawValue = FormValueOf<Exercise>;

type NewExerciseFormRawValue = FormValueOf<NewExercise>;

type ExerciseFormDefaults = Pick<NewExercise, 'id' | 'lastModifiedDate' | 'createdDate'>;

type ExerciseFormGroupContent = {
  id: FormControl<ExerciseFormRawValue['id'] | NewExercise['id']>;
  name: FormControl<ExerciseFormRawValue['name']>;
  bodyPartId: FormControl<ExerciseFormRawValue['bodyPart']>;
  muscle: FormControl<ExerciseFormRawValue['muscle']>;
  typeId: FormControl<ExerciseFormRawValue['type']>;
  positionId: FormControl<ExerciseFormRawValue['position']>;
  movementId: FormControl<ExerciseFormRawValue['movement']>;
  toolId: FormControl<ExerciseFormRawValue['tool']>;
  mediaId: FormControl<ExerciseFormRawValue['mediaId']>;
  description: FormControl<ExerciseFormRawValue['description']>;
  firstMediaId: FormControl<ExerciseFormRawValue['firstMediaId']>;
  secondMediaId: FormControl<ExerciseFormRawValue['secondMediaId']>;
  lastModifiedBy: FormControl<ExerciseFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ExerciseFormRawValue['lastModifiedDate']>;
  createdBy: FormControl<ExerciseFormRawValue['createdBy']>;
  createdDate: FormControl<ExerciseFormRawValue['createdDate']>;
};

export type ExerciseFormGroup = FormGroup<ExerciseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExerciseFormService {
  createExerciseFormGroup(exercise: ExerciseFormGroupInput = { id: null }): ExerciseFormGroup {
    const exerciseRawValue = this.convertExerciseToExerciseRawValue({
      ...this.getFormDefaults(),
      ...exercise,
    });
    return new FormGroup<ExerciseFormGroupContent>({
      id: new FormControl(
        { value: exerciseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(exerciseRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      bodyPartId: new FormControl(exerciseRawValue.bodyPart, {
        validators: [Validators.required],
      }),
      muscle: new FormControl(exerciseRawValue.muscle, {
        validators: [Validators.required],
      }),
      typeId: new FormControl(exerciseRawValue.type, {
        validators: [Validators.required],
      }),
      positionId: new FormControl(exerciseRawValue.position, {
        validators: [Validators.required],
      }),
      movementId: new FormControl(exerciseRawValue.movement, {
        validators: [Validators.required],
      }),
      toolId: new FormControl(exerciseRawValue.tool, {
        validators: [Validators.required],
      }),
      mediaId: new FormControl(exerciseRawValue.mediaId, {
        validators: [Validators.required],
      }),
      description: new FormControl(exerciseRawValue.description, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(350)],
      }),
      firstMediaId: new FormControl(exerciseRawValue.firstMediaId),
      secondMediaId: new FormControl(exerciseRawValue.secondMediaId),
      lastModifiedBy: new FormControl(exerciseRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(exerciseRawValue.lastModifiedDate),
      createdBy: new FormControl(exerciseRawValue.createdBy),
      createdDate: new FormControl(exerciseRawValue.createdDate),
    });
  }

  getExercise(form: ExerciseFormGroup): Exercise | NewExercise {
    return this.convertExerciseRawValueToExercise(form.getRawValue() as ExerciseFormRawValue | NewExerciseFormRawValue);
  }

  resetForm(form: ExerciseFormGroup, exercise: ExerciseFormGroupInput): void {
    const exerciseRawValue = this.convertExerciseToExerciseRawValue({ ...this.getFormDefaults(), ...exercise });
    form.reset(
      {
        ...exerciseRawValue,
        id: { value: exerciseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ExerciseFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      lastModifiedDate: currentTime,
      createdDate: currentTime,
    };
  }

  private convertExerciseRawValueToExercise(rawExercise: ExerciseFormRawValue | NewExerciseFormRawValue): Exercise | NewExercise {
    return {
      ...rawExercise,
      lastModifiedDate: dayjs(rawExercise.lastModifiedDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawExercise.createdDate, DATE_TIME_FORMAT),
    };
  }

  private convertExerciseToExerciseRawValue(
    exercise: Exercise | (Partial<NewExercise> & ExerciseFormDefaults),
  ): ExerciseFormRawValue | PartialWithRequiredKeyOf<NewExerciseFormRawValue> {
    return {
      ...exercise,
      lastModifiedDate: exercise.lastModifiedDate ? exercise.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: exercise.createdDate ? exercise.createdDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
