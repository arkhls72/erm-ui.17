import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Medication, NewMedication } from '../medication.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Medication for edit and NewMedicationFormGroupInput for create.
 */
type MedicationFormGroupInput = Medication | PartialWithRequiredKeyOf<NewMedication>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Medication | NewMedication> = Omit<T, 'startDate' | 'endDate' | 'createdDate' | 'lastModifiedDate'> & {
  startDate?: string | null;
  endDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type MedicationFormRawValue = FormValueOf<Medication>;

type NewMedicationFormRawValue = FormValueOf<NewMedication>;

type MedicationFormDefaults = Pick<NewMedication, 'id' | 'startDate' | 'endDate' | 'createdDate' | 'lastModifiedDate'>;

type MedicationFormGroupContent = {
  id: FormControl<MedicationFormRawValue['id'] | NewMedication['id']>;
  name: FormControl<MedicationFormRawValue['name']>;
  reasonFor: FormControl<MedicationFormRawValue['reasonFor']>;
  note: FormControl<MedicationFormRawValue['note']>;
  startDate: FormControl<MedicationFormRawValue['startDate']>;
  endDate: FormControl<MedicationFormRawValue['endDate']>;
  createdDate: FormControl<MedicationFormRawValue['createdDate']>;
  createdBy: FormControl<MedicationFormRawValue['createdBy']>;
  lastModifiedDate: FormControl<MedicationFormRawValue['lastModifiedDate']>;
  lastModifiedBy: FormControl<MedicationFormRawValue['lastModifiedBy']>;
};

export type MedicationFormGroup = FormGroup<MedicationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MedicationFormService {
  createMedicationFormGroup(medication: MedicationFormGroupInput = { id: null }): MedicationFormGroup {
    const medicationRawValue = this.convertMedicationToMedicationRawValue({
      ...this.getFormDefaults(),
      ...medication,
    });
    return new FormGroup<MedicationFormGroupContent>({
      id: new FormControl(
        { value: medicationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(medicationRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      reasonFor: new FormControl(medicationRawValue.reasonFor, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      note: new FormControl(medicationRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      startDate: new FormControl(medicationRawValue.startDate, {
        validators: [Validators.required],
      }),
      endDate: new FormControl(medicationRawValue.endDate),
      createdDate: new FormControl(medicationRawValue.createdDate),
      createdBy: new FormControl(medicationRawValue.createdBy),
      lastModifiedDate: new FormControl(medicationRawValue.lastModifiedDate),
      lastModifiedBy: new FormControl(medicationRawValue.lastModifiedBy),
    });
  }

  getMedication(form: MedicationFormGroup): Medication | NewMedication {
    return this.convertMedicationRawValueToMedication(form.getRawValue() as MedicationFormRawValue | NewMedicationFormRawValue);
  }

  resetForm(form: MedicationFormGroup, medication: MedicationFormGroupInput): void {
    const medicationRawValue = this.convertMedicationToMedicationRawValue({ ...this.getFormDefaults(), ...medication });
    form.reset(
      {
        ...medicationRawValue,
        id: { value: medicationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MedicationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      endDate: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertMedicationRawValueToMedication(
    rawMedication: MedicationFormRawValue | NewMedicationFormRawValue,
  ): Medication | NewMedication {
    return {
      ...rawMedication,
      startDate: dayjs(rawMedication.startDate, DATE_TIME_FORMAT),
      endDate: dayjs(rawMedication.endDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawMedication.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawMedication.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertMedicationToMedicationRawValue(
    medication: Medication | (Partial<NewMedication> & MedicationFormDefaults),
  ): MedicationFormRawValue | PartialWithRequiredKeyOf<NewMedicationFormRawValue> {
    return {
      ...medication,
      startDate: medication.startDate ? medication.startDate.format(DATE_TIME_FORMAT) : undefined,
      endDate: medication.endDate ? medication.endDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: medication.createdDate ? medication.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: medication.lastModifiedDate ? medication.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
