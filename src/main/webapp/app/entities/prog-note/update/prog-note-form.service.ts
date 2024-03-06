import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ProgNote, NewProgNote } from '../prog-note.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ProgNote for edit and NewProgNoteFormGroupInput for create.
 */
type ProgNoteFormGroupInput = ProgNote | PartialWithRequiredKeyOf<NewProgNote>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ProgNote | NewProgNote> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ProgNoteFormRawValue = FormValueOf<ProgNote>;

type NewProgNoteFormRawValue = FormValueOf<NewProgNote>;

type ProgNoteFormDefaults = Pick<NewProgNote, 'id' | 'createdDate' | 'lastModifiedDate'>;

type ProgNoteFormGroupContent = {
  id: FormControl<ProgNoteFormRawValue['id'] | NewProgNote['id']>;
  progId: FormControl<ProgNoteFormRawValue['progId']>;
  note: FormControl<ProgNoteFormRawValue['note']>;
  createdBy: FormControl<ProgNoteFormRawValue['createdBy']>;
  createdDate: FormControl<ProgNoteFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ProgNoteFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ProgNoteFormRawValue['lastModifiedDate']>;
};

export type ProgNoteFormGroup = FormGroup<ProgNoteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProgNoteFormService {
  createProgNoteFormGroup(progNote: ProgNoteFormGroupInput = { id: null }): ProgNoteFormGroup {
    const progNoteRawValue = this.convertProgNoteToProgNoteRawValue({
      ...this.getFormDefaults(),
      ...progNote,
    });
    return new FormGroup<ProgNoteFormGroupContent>({
      id: new FormControl(
        { value: progNoteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      progId: new FormControl(progNoteRawValue.progId, {
        validators: [Validators.required],
      }),
      note: new FormControl(progNoteRawValue.note, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(350)],
      }),
      createdBy: new FormControl(progNoteRawValue.createdBy),
      createdDate: new FormControl(progNoteRawValue.createdDate),
      lastModifiedBy: new FormControl(progNoteRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(progNoteRawValue.lastModifiedDate),
    });
  }

  getProgNote(form: ProgNoteFormGroup): ProgNote | NewProgNote {
    return this.convertProgNoteRawValueToProgNote(form.getRawValue() as ProgNoteFormRawValue | NewProgNoteFormRawValue);
  }

  resetForm(form: ProgNoteFormGroup, progNote: ProgNoteFormGroupInput): void {
    const progNoteRawValue = this.convertProgNoteToProgNoteRawValue({ ...this.getFormDefaults(), ...progNote });
    form.reset(
      {
        ...progNoteRawValue,
        id: { value: progNoteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProgNoteFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertProgNoteRawValueToProgNote(rawProgNote: ProgNoteFormRawValue | NewProgNoteFormRawValue): ProgNote | NewProgNote {
    return {
      ...rawProgNote,
      createdDate: dayjs(rawProgNote.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawProgNote.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertProgNoteToProgNoteRawValue(
    progNote: ProgNote | (Partial<NewProgNote> & ProgNoteFormDefaults),
  ): ProgNoteFormRawValue | PartialWithRequiredKeyOf<NewProgNoteFormRawValue> {
    return {
      ...progNote,
      createdDate: progNote.createdDate ? progNote.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: progNote.lastModifiedDate ? progNote.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
