import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Instruction, NewInstruction } from '../instruction.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Instruction for edit and NewInstructionFormGroupInput for create.
 */
type InstructionFormGroupInput = Instruction | PartialWithRequiredKeyOf<NewInstruction>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Instruction | NewInstruction> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type InstructionFormRawValue = FormValueOf<Instruction>;

type NewInstructionFormRawValue = FormValueOf<NewInstruction>;

type InstructionFormDefaults = Pick<NewInstruction, 'id' | 'createdDate' | 'lastModifiedDate'>;

type InstructionFormGroupContent = {
  id: FormControl<InstructionFormRawValue['id'] | NewInstruction['id']>;
  repeat: FormControl<InstructionFormRawValue['repeat']>;
  hold: FormControl<InstructionFormRawValue['hold']>;
  complete: FormControl<InstructionFormRawValue['complete']>;
  perform: FormControl<InstructionFormRawValue['perform']>;
  note: FormControl<InstructionFormRawValue['note']>;
  durationNumber: FormControl<InstructionFormRawValue['durationNumber']>;
  name: FormControl<InstructionFormRawValue['name']>;
  exerciseId: FormControl<InstructionFormRawValue['exerciseId']>;
  createdDate: FormControl<InstructionFormRawValue['createdDate']>;
  createdBy: FormControl<InstructionFormRawValue['createdBy']>;
  lastModifiedDate: FormControl<InstructionFormRawValue['lastModifiedDate']>;
  lastModifiedBy: FormControl<InstructionFormRawValue['lastModifiedBy']>;
};

export type InstructionFormGroup = FormGroup<InstructionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InstructionFormService {
  createInstructionFormGroup(instruction: InstructionFormGroupInput = { id: null }): InstructionFormGroup {
    const instructionRawValue = this.convertInstructionToInstructionRawValue({
      ...this.getFormDefaults(),
      ...instruction,
    });
    return new FormGroup<InstructionFormGroupContent>({
      id: new FormControl(
        { value: instructionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      repeat: new FormControl(instructionRawValue.repeat),
      hold: new FormControl(instructionRawValue.hold),
      complete: new FormControl(instructionRawValue.complete),
      perform: new FormControl(instructionRawValue.perform),
      note: new FormControl(instructionRawValue.note, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      durationNumber: new FormControl(instructionRawValue.durationNumber),
      name: new FormControl(instructionRawValue.name),
      exerciseId: new FormControl(instructionRawValue.exerciseId),
      createdDate: new FormControl(instructionRawValue.createdDate),
      createdBy: new FormControl(instructionRawValue.createdBy),
      lastModifiedDate: new FormControl(instructionRawValue.lastModifiedDate),
      lastModifiedBy: new FormControl(instructionRawValue.lastModifiedBy),
    });
  }

  getInstruction(form: InstructionFormGroup): Instruction | NewInstruction {
    return this.convertInstructionRawValueToInstruction(form.getRawValue() as InstructionFormRawValue | NewInstructionFormRawValue);
  }

  resetForm(form: InstructionFormGroup, instruction: InstructionFormGroupInput): void {
    const instructionRawValue = this.convertInstructionToInstructionRawValue({ ...this.getFormDefaults(), ...instruction });
    form.reset(
      {
        ...instructionRawValue,
        id: { value: instructionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InstructionFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertInstructionRawValueToInstruction(
    rawInstruction: InstructionFormRawValue | NewInstructionFormRawValue,
  ): Instruction | NewInstruction {
    return {
      ...rawInstruction,
      createdDate: dayjs(rawInstruction.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawInstruction.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertInstructionToInstructionRawValue(
    instruction: Instruction | (Partial<NewInstruction> & InstructionFormDefaults),
  ): InstructionFormRawValue | PartialWithRequiredKeyOf<NewInstructionFormRawValue> {
    return {
      ...instruction,
      createdDate: instruction.createdDate ? instruction.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: instruction.lastModifiedDate ? instruction.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
