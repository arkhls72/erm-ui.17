import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { PlanNote, NewPlanNote } from '../plan-note.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts PlanNote for edit and NewPlanNoteFormGroupInput for create.
 */
type PlanNoteFormGroupInput = PlanNote | PartialWithRequiredKeyOf<NewPlanNote>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends PlanNote | NewPlanNote> = Omit<T, 'createdDate' | 'lastModfiedDate'> & {
  createdDate?: string | null;
  lastModfiedDate?: string | null;
};

type PlanNoteFormRawValue = FormValueOf<PlanNote>;

type NewPlanNoteFormRawValue = FormValueOf<NewPlanNote>;

type PlanNoteFormDefaults = Pick<NewPlanNote, 'id' | 'createdDate' | 'lastModifiedDate'>;

type PlanNoteFormGroupContent = {
  id: FormControl<PlanNoteFormRawValue['id'] | NewPlanNote['id']>;
  planId: FormControl<PlanNoteFormRawValue['planId']>;
  note: FormControl<PlanNoteFormRawValue['note']>;
  createdDate: FormControl<PlanNoteFormRawValue['createdDate']>;
  createdBy: FormControl<PlanNoteFormRawValue['createdBy']>;
  lastModifiedBy: FormControl<PlanNoteFormRawValue['lastModifiedBy']>;
  lastModfiedDate: FormControl<PlanNoteFormRawValue['lastModfiedDate']>;
};

export type PlanNoteFormGroup = FormGroup<PlanNoteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlanNoteFormService {
  createPlanNoteFormGroup(planNote: PlanNoteFormGroupInput = { id: null }): PlanNoteFormGroup {
    const planNoteRawValue = this.convertPlanNoteToPlanNoteRawValue({
      ...this.getFormDefaults(),
      ...planNote,
    });
    return new FormGroup<PlanNoteFormGroupContent>({
      id: new FormControl(
        { value: planNoteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      planId: new FormControl(planNoteRawValue.planId, {
        validators: [Validators.required],
      }),
      note: new FormControl(planNoteRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      createdDate: new FormControl(planNoteRawValue.createdDate),
      createdBy: new FormControl(planNoteRawValue.createdBy),
      lastModifiedBy: new FormControl(planNoteRawValue.lastModifiedBy),
      lastModfiedDate: new FormControl(planNoteRawValue.lastModfiedDate),
    });
  }

  getPlanNote(form: PlanNoteFormGroup): PlanNote | NewPlanNote {
    return this.convertPlanNoteRawValueToPlanNote(form.getRawValue() as PlanNoteFormRawValue | NewPlanNoteFormRawValue);
  }

  resetForm(form: PlanNoteFormGroup, planNote: PlanNoteFormGroupInput): void {
    const planNoteRawValue = this.convertPlanNoteToPlanNoteRawValue({ ...this.getFormDefaults(), ...planNote });
    form.reset(
      {
        ...planNoteRawValue,
        id: { value: planNoteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PlanNoteFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertPlanNoteRawValueToPlanNote(rawPlanNote: PlanNoteFormRawValue | NewPlanNoteFormRawValue): PlanNote | NewPlanNote {
    return {
      ...rawPlanNote,
      createdDate: dayjs(rawPlanNote.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawPlanNote.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertPlanNoteToPlanNoteRawValue(
    planNote: PlanNote | (Partial<NewPlanNote> & PlanNoteFormDefaults),
  ): PlanNoteFormRawValue | PartialWithRequiredKeyOf<NewPlanNoteFormRawValue> {
    return {
      ...planNote,
      createdDate: planNote.createdDate ? planNote.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModfiedDate: planNote.lastModifiedDate ? planNote.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
