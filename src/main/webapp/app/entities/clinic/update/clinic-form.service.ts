import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Clinic, NewClinic } from '../clinic.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Clinic for edit and NewClinicFormGroupInput for create.
 */
type ClinicFormGroupInput = Clinic | PartialWithRequiredKeyOf<NewClinic>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Clinic | NewClinic> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ClinicFormRawValue = FormValueOf<Clinic>;

type NewClinicFormRawValue = FormValueOf<NewClinic>;

type ClinicFormDefaults = Pick<NewClinic, 'id' | 'createdDate' | 'lastModifiedDate'>;

type ClinicFormGroupContent = {
  id: FormControl<ClinicFormRawValue['id'] | NewClinic['id']>;
  name: FormControl<ClinicFormRawValue['name']>;
  phone: FormControl<ClinicFormRawValue['phone']>;
  fax: FormControl<ClinicFormRawValue['fax']>;
  email: FormControl<ClinicFormRawValue['email']>;
  addressId: FormControl<ClinicFormRawValue['addressId']>;
  createdDate: FormControl<ClinicFormRawValue['createdDate']>;
  createdBy: FormControl<ClinicFormRawValue['createdBy']>;
  lastModifiedBy: FormControl<ClinicFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ClinicFormRawValue['lastModifiedDate']>;
};

export type ClinicFormGroup = FormGroup<ClinicFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClinicFormService {
  createClinicFormGroup(clinic: ClinicFormGroupInput = { id: null }): ClinicFormGroup {
    const clinicRawValue = this.convertClinicToClinicRawValue({
      ...this.getFormDefaults(),
      ...clinic,
    });
    return new FormGroup<ClinicFormGroupContent>({
      id: new FormControl(
        { value: clinicRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(clinicRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      phone: new FormControl(clinicRawValue.phone, {
        validators: [Validators.required, Validators.minLength(12), Validators.maxLength(15)],
      }),
      fax: new FormControl(clinicRawValue.fax, {
        validators: [Validators.maxLength(15)],
      }),
      email: new FormControl(clinicRawValue.email, {
        validators: [Validators.maxLength(320)],
      }),
      addressId: new FormControl(clinicRawValue.addressId, {
        validators: [Validators.required],
      }),
      createdDate: new FormControl(clinicRawValue.createdDate),
      createdBy: new FormControl(clinicRawValue.createdBy),
      lastModifiedBy: new FormControl(clinicRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(clinicRawValue.lastModifiedDate),
    });
  }

  getClinic(form: ClinicFormGroup): Clinic | NewClinic {
    return this.convertClinicRawValueToClinic(form.getRawValue() as ClinicFormRawValue | NewClinicFormRawValue);
  }

  resetForm(form: ClinicFormGroup, clinic: ClinicFormGroupInput): void {
    const clinicRawValue = this.convertClinicToClinicRawValue({ ...this.getFormDefaults(), ...clinic });
    form.reset(
      {
        ...clinicRawValue,
        id: { value: clinicRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ClinicFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertClinicRawValueToClinic(rawClinic: ClinicFormRawValue | NewClinicFormRawValue): Clinic | NewClinic {
    return {
      ...rawClinic,
      createdDate: dayjs(rawClinic.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawClinic.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertClinicToClinicRawValue(
    clinic: Clinic | (Partial<NewClinic> & ClinicFormDefaults),
  ): ClinicFormRawValue | PartialWithRequiredKeyOf<NewClinicFormRawValue> {
    return {
      ...clinic,
      createdDate: clinic.createdDate ? clinic.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: clinic.lastModifiedDate ? clinic.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
