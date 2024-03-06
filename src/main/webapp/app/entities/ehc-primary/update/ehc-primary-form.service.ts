import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { EhcPrimary, NewEhcPrimary } from '../ehc-primary.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts EhcPrimary for edit and NewEhcPrimaryFormGroupInput for create.
 */
type EhcPrimaryFormGroupInput = EhcPrimary | PartialWithRequiredKeyOf<NewEhcPrimary>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends EhcPrimary | NewEhcPrimary> = Omit<T, 'endDate' | 'lastModifiedDate'> & {
  endDate?: string | null;
  lastModifiedDate?: string | null;
};

type EhcPrimaryFormRawValue = FormValueOf<EhcPrimary>;

type NewEhcPrimaryFormRawValue = FormValueOf<NewEhcPrimary>;

type EhcPrimaryFormDefaults = Pick<NewEhcPrimary, 'id' | 'endDate' | 'lastModifiedDate'>;

type EhcPrimaryFormGroupContent = {
  id: FormControl<EhcPrimaryFormRawValue['id'] | NewEhcPrimary['id']>;
  ehcId: FormControl<EhcPrimaryFormRawValue['ehcId']>;
  clientId: FormControl<EhcPrimaryFormRawValue['clientId']>;
  name: FormControl<EhcPrimaryFormRawValue['name']>;
  status: FormControl<EhcPrimaryFormRawValue['status']>;
  ehcType: FormControl<EhcPrimaryFormRawValue['ehcType']>;
  groupNumber: FormControl<EhcPrimaryFormRawValue['groupNumber']>;
  policyNumber: FormControl<EhcPrimaryFormRawValue['policyNumber']>;
  policyHolder: FormControl<EhcPrimaryFormRawValue['policyHolder']>;
  certificateNumber: FormControl<EhcPrimaryFormRawValue['certificateNumber']>;
  note: FormControl<EhcPrimaryFormRawValue['note']>;
  endDate: FormControl<EhcPrimaryFormRawValue['endDate']>;
  phone: FormControl<EhcPrimaryFormRawValue['phone']>;
  fax: FormControl<EhcPrimaryFormRawValue['fax']>;
  email: FormControl<EhcPrimaryFormRawValue['email']>;
  createdDate: FormControl<EhcPrimaryFormRawValue['createdDate']>;
  createdBy: FormControl<EhcPrimaryFormRawValue['createdBy']>;
  lastModifiedDate: FormControl<EhcPrimaryFormRawValue['lastModifiedDate']>;
  lastModifiedBy: FormControl<EhcPrimaryFormRawValue['lastModifiedBy']>;
};

export type EhcPrimaryFormGroup = FormGroup<EhcPrimaryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EhcPrimaryFormService {
  createEhcPrimaryFormGroup(ehcPrimary: EhcPrimaryFormGroupInput = { id: null }): EhcPrimaryFormGroup {
    const ehcPrimaryRawValue = this.convertEhcPrimaryToEhcPrimaryRawValue({
      ...this.getFormDefaults(),
      ...ehcPrimary,
    });
    return new FormGroup<EhcPrimaryFormGroupContent>({
      id: new FormControl(
        { value: ehcPrimaryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      ehcId: new FormControl(ehcPrimaryRawValue.ehcId, {
        validators: [Validators.required],
      }),
      clientId: new FormControl(ehcPrimaryRawValue.clientId, {
        validators: [Validators.required],
      }),
      name: new FormControl(ehcPrimaryRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      status: new FormControl(ehcPrimaryRawValue.status, {
        validators: [Validators.maxLength(50)],
      }),
      ehcType: new FormControl(ehcPrimaryRawValue.ehcType, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      groupNumber: new FormControl(ehcPrimaryRawValue.groupNumber, {
        validators: [Validators.maxLength(50)],
      }),
      policyNumber: new FormControl(ehcPrimaryRawValue.policyNumber, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      policyHolder: new FormControl(ehcPrimaryRawValue.policyHolder, {
        validators: [Validators.maxLength(50)],
      }),
      certificateNumber: new FormControl(ehcPrimaryRawValue.certificateNumber, {
        validators: [Validators.maxLength(50)],
      }),
      note: new FormControl(ehcPrimaryRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      endDate: new FormControl(ehcPrimaryRawValue.endDate),
      phone: new FormControl(ehcPrimaryRawValue.phone, {
        validators: [Validators.maxLength(15)],
      }),
      fax: new FormControl(ehcPrimaryRawValue.fax, {
        validators: [Validators.maxLength(15)],
      }),
      email: new FormControl(ehcPrimaryRawValue.email, {
        validators: [Validators.maxLength(320)],
      }),
      createdDate: new FormControl(ehcPrimaryRawValue.createdDate),
      createdBy: new FormControl(ehcPrimaryRawValue.createdBy),
      lastModifiedDate: new FormControl(ehcPrimaryRawValue.lastModifiedDate),
      lastModifiedBy: new FormControl(ehcPrimaryRawValue.lastModifiedBy),
    });
  }

  getEhcPrimary(form: EhcPrimaryFormGroup): EhcPrimary | NewEhcPrimary {
    return this.convertEhcPrimaryRawValueToEhcPrimary(form.getRawValue() as EhcPrimaryFormRawValue | NewEhcPrimaryFormRawValue);
  }

  resetForm(form: EhcPrimaryFormGroup, ehcPrimary: EhcPrimaryFormGroupInput): void {
    const ehcPrimaryRawValue = this.convertEhcPrimaryToEhcPrimaryRawValue({ ...this.getFormDefaults(), ...ehcPrimary });
    form.reset(
      {
        ...ehcPrimaryRawValue,
        id: { value: ehcPrimaryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EhcPrimaryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      endDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertEhcPrimaryRawValueToEhcPrimary(
    rawEhcPrimary: EhcPrimaryFormRawValue | NewEhcPrimaryFormRawValue,
  ): EhcPrimary | NewEhcPrimary {
    return {
      ...rawEhcPrimary,
      endDate: dayjs(rawEhcPrimary.endDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawEhcPrimary.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertEhcPrimaryToEhcPrimaryRawValue(
    ehcPrimary: EhcPrimary | (Partial<NewEhcPrimary> & EhcPrimaryFormDefaults),
  ): EhcPrimaryFormRawValue | PartialWithRequiredKeyOf<NewEhcPrimaryFormRawValue> {
    return {
      ...ehcPrimary,
      endDate: ehcPrimary.endDate ? ehcPrimary.endDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: ehcPrimary.lastModifiedDate ? ehcPrimary.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
