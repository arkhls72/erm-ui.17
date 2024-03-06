import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { SoapNote, NewSoapNote } from '../soap-note.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts SoapNote for edit and NewSoapNoteFormGroupInput for create.
 */
type SoapNoteFormGroupInput = SoapNote | PartialWithRequiredKeyOf<NewSoapNote>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends SoapNote | NewSoapNote> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type SoapNoteFormRawValue = FormValueOf<SoapNote>;

type NewSoapNoteFormRawValue = FormValueOf<NewSoapNote>;

type SoapNoteFormDefaults = Pick<NewSoapNote, 'id' | 'createdDate' | 'lastModifiedDate'>;

type SoapNoteFormGroupContent = {
  id: FormControl<SoapNoteFormRawValue['id'] | NewSoapNote['id']>;
  name: FormControl<SoapNoteFormRawValue['name']>;
  subjective: FormControl<SoapNoteFormRawValue['subjective']>;
  objective: FormControl<SoapNoteFormRawValue['objective']>;
  analysis: FormControl<SoapNoteFormRawValue['analysis']>;
  evaluation: FormControl<SoapNoteFormRawValue['evaluation']>;
  intervention: FormControl<SoapNoteFormRawValue['intervention']>;
  clientId: FormControl<SoapNoteFormRawValue['clientId']>;
  assessments: FormControl<SoapNoteFormRawValue['assessments']>;
  createdBy: FormControl<SoapNoteFormRawValue['createdBy']>;
  createdDate: FormControl<SoapNoteFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<SoapNoteFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<SoapNoteFormRawValue['lastModifiedDate']>;
};

export type SoapNoteFormGroup = FormGroup<SoapNoteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SoapNoteFormService {
  createSoapNoteFormGroup(soapNote: SoapNoteFormGroupInput = { id: null }): SoapNoteFormGroup {
    const soapNoteRawValue = this.convertSoapNoteToSoapNoteRawValue({
      ...this.getFormDefaults(),
      ...soapNote,
    });
    return new FormGroup<SoapNoteFormGroupContent>({
      id: new FormControl(
        { value: soapNoteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(soapNoteRawValue.name, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      subjective: new FormControl(soapNoteRawValue.subjective, {
        validators: [Validators.required, Validators.maxLength(500)],
      }),
      objective: new FormControl(soapNoteRawValue.objective, {
        validators: [Validators.required, Validators.maxLength(500)],
      }),
      analysis: new FormControl(soapNoteRawValue.analysis, {
        validators: [Validators.maxLength(500)],
      }),
      evaluation: new FormControl(soapNoteRawValue.evaluation),
      intervention: new FormControl(soapNoteRawValue.intervention),
      clientId: new FormControl(soapNoteRawValue.clientId, {
        validators: [Validators.required],
      }),
      assessments: new FormControl(soapNoteRawValue.assessments),
      createdBy: new FormControl(soapNoteRawValue.createdBy),
      createdDate: new FormControl(soapNoteRawValue.createdDate),
      lastModifiedBy: new FormControl(soapNoteRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(soapNoteRawValue.lastModifiedDate),
    });
  }

  getSoapNote(form: SoapNoteFormGroup): SoapNote | NewSoapNote {
    return this.convertSoapNoteRawValueToSoapNote(form.getRawValue() as SoapNoteFormRawValue | NewSoapNoteFormRawValue);
  }

  resetForm(form: SoapNoteFormGroup, soapNote: SoapNoteFormGroupInput): void {
    const soapNoteRawValue = this.convertSoapNoteToSoapNoteRawValue({ ...this.getFormDefaults(), ...soapNote });
    form.reset(
      {
        ...soapNoteRawValue,
        id: { value: soapNoteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SoapNoteFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertSoapNoteRawValueToSoapNote(rawSoapNote: SoapNoteFormRawValue | NewSoapNoteFormRawValue): SoapNote | NewSoapNote {
    return {
      ...rawSoapNote,
      createdDate: dayjs(rawSoapNote.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawSoapNote.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertSoapNoteToSoapNoteRawValue(
    soapNote: SoapNote | (Partial<NewSoapNote> & SoapNoteFormDefaults),
  ): SoapNoteFormRawValue | PartialWithRequiredKeyOf<NewSoapNoteFormRawValue> {
    return {
      ...soapNote,
      createdDate: soapNote.createdDate ? soapNote.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: soapNote.lastModifiedDate ? soapNote.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
