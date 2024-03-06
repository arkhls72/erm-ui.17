import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ProgExerciseInstruction, NewProgExerciseInstruction } from '../prog-exercise-instruction.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ProgExerciseInstruction for edit and NewProgExerciseInstructionFormGroupInput for create.
 */
type ProgExerciseInstructionFormGroupInput = ProgExerciseInstruction | PartialWithRequiredKeyOf<NewProgExerciseInstruction>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ProgExerciseInstruction | NewProgExerciseInstruction> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ProgExerciseInstructionFormRawValue = FormValueOf<ProgExerciseInstruction>;

type NewProgExerciseInstructionFormRawValue = FormValueOf<NewProgExerciseInstruction>;

type ProgExerciseInstructionFormDefaults = Pick<NewProgExerciseInstruction, 'id' | 'createdDate' | 'lastModifiedDate'>;

type ProgExerciseInstructionFormGroupContent = {
  id: FormControl<ProgExerciseInstructionFormRawValue['id'] | NewProgExerciseInstruction['id']>;
  exerciseId: FormControl<ProgExerciseInstructionFormRawValue['exerciseId']>;
  progId: FormControl<ProgExerciseInstructionFormRawValue['progId']>;
  instruction: FormControl<ProgExerciseInstructionFormRawValue['instruction']>;
  createdBy: FormControl<ProgExerciseInstructionFormRawValue['createdBy']>;
  createdDate: FormControl<ProgExerciseInstructionFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ProgExerciseInstructionFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ProgExerciseInstructionFormRawValue['lastModifiedDate']>;
};

export type ProgExerciseInstructionFormGroup = FormGroup<ProgExerciseInstructionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProgExerciseInstructionFormService {
  createProgExerciseInstructionFormGroup(
    progExerciseInstruction: ProgExerciseInstructionFormGroupInput = { id: null },
  ): ProgExerciseInstructionFormGroup {
    const progExerciseInstructionRawValue = this.convertProgExerciseInstructionToProgExerciseInstructionRawValue({
      ...this.getFormDefaults(),
      ...progExerciseInstruction,
    });
    return new FormGroup<ProgExerciseInstructionFormGroupContent>({
      id: new FormControl(
        { value: progExerciseInstructionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      exerciseId: new FormControl(progExerciseInstructionRawValue.exerciseId, {
        validators: [Validators.required],
      }),
      progId: new FormControl(progExerciseInstructionRawValue.progId, {
        validators: [Validators.required],
      }),
      instruction: new FormControl(progExerciseInstructionRawValue.instruction),
      createdBy: new FormControl(progExerciseInstructionRawValue.createdBy),
      createdDate: new FormControl(progExerciseInstructionRawValue.createdDate),
      lastModifiedBy: new FormControl(progExerciseInstructionRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(progExerciseInstructionRawValue.lastModifiedDate),
    });
  }

  getProgExerciseInstruction(form: ProgExerciseInstructionFormGroup): ProgExerciseInstruction | NewProgExerciseInstruction {
    return this.convertProgExerciseInstructionRawValueToProgExerciseInstruction(
      form.getRawValue() as ProgExerciseInstructionFormRawValue | NewProgExerciseInstructionFormRawValue,
    );
  }

  resetForm(form: ProgExerciseInstructionFormGroup, progExerciseInstruction: ProgExerciseInstructionFormGroupInput): void {
    const progExerciseInstructionRawValue = this.convertProgExerciseInstructionToProgExerciseInstructionRawValue({
      ...this.getFormDefaults(),
      ...progExerciseInstruction,
    });
    form.reset(
      {
        ...progExerciseInstructionRawValue,
        id: { value: progExerciseInstructionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProgExerciseInstructionFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertProgExerciseInstructionRawValueToProgExerciseInstruction(
    rawProgExerciseInstruction: ProgExerciseInstructionFormRawValue | NewProgExerciseInstructionFormRawValue,
  ): ProgExerciseInstruction | NewProgExerciseInstruction {
    return {
      ...rawProgExerciseInstruction,
      createdDate: dayjs(rawProgExerciseInstruction.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawProgExerciseInstruction.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertProgExerciseInstructionToProgExerciseInstructionRawValue(
    progExerciseInstruction: ProgExerciseInstruction | (Partial<NewProgExerciseInstruction> & ProgExerciseInstructionFormDefaults),
  ): ProgExerciseInstructionFormRawValue | PartialWithRequiredKeyOf<NewProgExerciseInstructionFormRawValue> {
    return {
      ...progExerciseInstruction,
      createdDate: progExerciseInstruction.createdDate ? progExerciseInstruction.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: progExerciseInstruction.lastModifiedDate
        ? progExerciseInstruction.lastModifiedDate.format(DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
