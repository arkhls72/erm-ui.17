import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Assessment, NewAssessment } from '../assessment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Assessment for edit and NewAssessmentFormGroupInput for create.
 */
type AssessmentFormGroupInput = Assessment | PartialWithRequiredKeyOf<NewAssessment>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Assessment | NewAssessment> = Omit<T, 'lastModifiedDate'> & {
  lastModifiedDate?: string | null;
};

type AssessmentFormRawValue = FormValueOf<Assessment>;

type NewAssessmentFormRawValue = FormValueOf<NewAssessment>;

type AssessmentFormDefaults = Pick<NewAssessment, 'id' | 'isBack' | 'lastModifiedDate'>;

type AssessmentFormGroupContent = {
  id: FormControl<AssessmentFormRawValue['id'] | NewAssessment['id']>;
  name: FormControl<AssessmentFormRawValue['name']>;
  painIntensity: FormControl<AssessmentFormRawValue['painIntensity']>;
  sourcePain: FormControl<AssessmentFormRawValue['sourcePain']>;
  painOnSet: FormControl<AssessmentFormRawValue['painOnSet']>;
  aggravationPain: FormControl<AssessmentFormRawValue['aggravationPain']>;
  note: FormControl<AssessmentFormRawValue['note']>;
  clientId: FormControl<AssessmentFormRawValue['clientId']>;
  plans: FormControl<AssessmentFormRawValue['plans']>;
  isBack: FormControl<AssessmentFormRawValue['isBack']>;
  soapNote: FormControl<AssessmentFormRawValue['soapNote']>;
  createdBy: FormControl<AssessmentFormRawValue['createdBy']>;
  lastModifiedBy: FormControl<AssessmentFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<AssessmentFormRawValue['lastModifiedDate']>;
};

export type AssessmentFormGroup = FormGroup<AssessmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AssessmentFormService {
  createAssessmentFormGroup(assessment: AssessmentFormGroupInput = { id: null }): AssessmentFormGroup {
    const assessmentRawValue = this.convertAssessmentToAssessmentRawValue({
      ...this.getFormDefaults(),
      ...assessment,
    });
    return new FormGroup<AssessmentFormGroupContent>({
      id: new FormControl(
        { value: assessmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(assessmentRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      painIntensity: new FormControl(assessmentRawValue.painIntensity, {
        validators: [Validators.required],
      }),
      sourcePain: new FormControl(assessmentRawValue.sourcePain, {
        validators: [Validators.maxLength(350)],
      }),
      painOnSet: new FormControl(assessmentRawValue.painOnSet),
      aggravationPain: new FormControl(assessmentRawValue.aggravationPain),
      note: new FormControl(assessmentRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      clientId: new FormControl(assessmentRawValue.clientId, {
        validators: [Validators.required],
      }),
      plans: new FormControl(assessmentRawValue.plans),
      isBack: new FormControl(assessmentRawValue.isBack),
      soapNote: new FormControl(assessmentRawValue.soapNote, {
        validators: [Validators.maxLength(350)],
      }),
      createdBy: new FormControl(assessmentRawValue.createdBy),
      lastModifiedBy: new FormControl(assessmentRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(assessmentRawValue.lastModifiedDate),
    });
  }

  getAssessment(form: AssessmentFormGroup): Assessment | NewAssessment {
    return this.convertAssessmentRawValueToAssessment(form.getRawValue() as AssessmentFormRawValue | NewAssessmentFormRawValue);
  }

  resetForm(form: AssessmentFormGroup, assessment: AssessmentFormGroupInput): void {
    const assessmentRawValue = this.convertAssessmentToAssessmentRawValue({ ...this.getFormDefaults(), ...assessment });
    form.reset(
      {
        ...assessmentRawValue,
        id: { value: assessmentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AssessmentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      isBack: false,
      lastModifiedDate: currentTime,
    };
  }

  private convertAssessmentRawValueToAssessment(
    rawAssessment: AssessmentFormRawValue | NewAssessmentFormRawValue,
  ): Assessment | NewAssessment {
    return {
      ...rawAssessment,
      lastModifiedDate: dayjs(rawAssessment.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertAssessmentToAssessmentRawValue(
    assessment: Assessment | (Partial<NewAssessment> & AssessmentFormDefaults),
  ): AssessmentFormRawValue | PartialWithRequiredKeyOf<NewAssessmentFormRawValue> {
    return {
      ...assessment,
      lastModifiedDate: assessment.lastModifiedDate ? assessment.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
