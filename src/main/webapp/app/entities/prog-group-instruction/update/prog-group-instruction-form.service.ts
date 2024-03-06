import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ProgGroupInstruction, NewProgGroupInstruction } from '../prog-group-instruction.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ProgGroupInstruction for edit and NewProgGroupInstructionFormGroupInput for create.
 */
type ProgGroupInstructionFormGroupInput = ProgGroupInstruction | PartialWithRequiredKeyOf<NewProgGroupInstruction>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ProgGroupInstruction | NewProgGroupInstruction> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ProgGroupInstructionFormRawValue = FormValueOf<ProgGroupInstruction>;

type NewProgGroupInstructionFormRawValue = FormValueOf<NewProgGroupInstruction>;

type ProgGroupInstructionFormDefaults = Pick<NewProgGroupInstruction, 'id' | 'createdDate' | 'lastModifiedDate'>;

type ProgGroupInstructionFormGroupContent = {
  id: FormControl<ProgGroupInstructionFormRawValue['id'] | NewProgGroupInstruction['id']>;
  exerciseId: FormControl<ProgGroupInstructionFormRawValue['exerciseId']>;
  progId: FormControl<ProgGroupInstructionFormRawValue['progId']>;
  groupId: FormControl<ProgGroupInstructionFormRawValue['groupId']>;
  instructionId: FormControl<ProgGroupInstructionFormRawValue['instruction']>;
  createdBy: FormControl<ProgGroupInstructionFormRawValue['createdBy']>;
  createdDate: FormControl<ProgGroupInstructionFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ProgGroupInstructionFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ProgGroupInstructionFormRawValue['lastModifiedDate']>;
};

export type ProgGroupInstructionFormGroup = FormGroup<ProgGroupInstructionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProgGroupInstructionFormService {
  createProgGroupInstructionFormGroup(
    progGroupInstruction: ProgGroupInstructionFormGroupInput = { id: null },
  ): ProgGroupInstructionFormGroup {
    const progGroupInstructionRawValue = this.convertProgGroupInstructionToProgGroupInstructionRawValue({
      ...this.getFormDefaults(),
      ...progGroupInstruction,
    });
    return new FormGroup<ProgGroupInstructionFormGroupContent>({
      id: new FormControl(
        { value: progGroupInstructionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      exerciseId: new FormControl(progGroupInstructionRawValue.exerciseId, {
        validators: [Validators.required],
      }),
      progId: new FormControl(progGroupInstructionRawValue.progId, {
        validators: [Validators.required],
      }),
      groupId: new FormControl(progGroupInstructionRawValue.groupId),
      instructionId: new FormControl(progGroupInstructionRawValue.instruction, {
        validators: [Validators.required],
      }),
      createdBy: new FormControl(progGroupInstructionRawValue.createdBy),
      createdDate: new FormControl(progGroupInstructionRawValue.createdDate),
      lastModifiedBy: new FormControl(progGroupInstructionRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(progGroupInstructionRawValue.lastModifiedDate),
    });
  }

  getProgGroupInstruction(form: ProgGroupInstructionFormGroup): ProgGroupInstruction | NewProgGroupInstruction {
    return this.convertProgGroupInstructionRawValueToProgGroupInstruction(
      form.getRawValue() as ProgGroupInstructionFormRawValue | NewProgGroupInstructionFormRawValue,
    );
  }

  resetForm(form: ProgGroupInstructionFormGroup, progGroupInstruction: ProgGroupInstructionFormGroupInput): void {
    const progGroupInstructionRawValue = this.convertProgGroupInstructionToProgGroupInstructionRawValue({
      ...this.getFormDefaults(),
      ...progGroupInstruction,
    });
    form.reset(
      {
        ...progGroupInstructionRawValue,
        id: { value: progGroupInstructionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProgGroupInstructionFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertProgGroupInstructionRawValueToProgGroupInstruction(
    rawProgGroupInstruction: ProgGroupInstructionFormRawValue | NewProgGroupInstructionFormRawValue,
  ): ProgGroupInstruction | NewProgGroupInstruction {
    return {
      ...rawProgGroupInstruction,
      createdDate: dayjs(rawProgGroupInstruction.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawProgGroupInstruction.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertProgGroupInstructionToProgGroupInstructionRawValue(
    progGroupInstruction: ProgGroupInstruction | (Partial<NewProgGroupInstruction> & ProgGroupInstructionFormDefaults),
  ): ProgGroupInstructionFormRawValue | PartialWithRequiredKeyOf<NewProgGroupInstructionFormRawValue> {
    return {
      ...progGroupInstruction,
      createdDate: progGroupInstruction.createdDate ? progGroupInstruction.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: progGroupInstruction.lastModifiedDate ? progGroupInstruction.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
