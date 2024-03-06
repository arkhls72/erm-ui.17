import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Ehc, NewEhc } from '../ehc.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Ehc for edit and NewEhcFormGroupInput for create.
 */
type EhcFormGroupInput = Ehc | PartialWithRequiredKeyOf<NewEhc>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Ehc | NewEhc> = Omit<T, 'endDate' | 'createdDate' | 'lastModifiedDate'> & {
  endDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type EhcFormRawValue = FormValueOf<Ehc>;

type NewEhcFormRawValue = FormValueOf<NewEhc>;

type EhcFormDefaults = Pick<NewEhc, 'id' | 'endDate' | 'createdDate' | 'lastModifiedDate'>;

type EhcFormGroupContent = {
  id: FormControl<EhcFormRawValue['id'] | NewEhc['id']>;
  certificateNumber: FormControl<EhcFormRawValue['certificateNumber']>;
  policyNumber: FormControl<EhcFormRawValue['policyNumber']>;
  policyHolder: FormControl<EhcFormRawValue['policyHolder']>;
  groupNumber: FormControl<EhcFormRawValue['groupNumber']>;
  name: FormControl<EhcFormRawValue['name']>;
  note: FormControl<EhcFormRawValue['note']>;
  type: FormControl<EhcFormRawValue['type']>;
  status: FormControl<EhcFormRawValue['status']>;
  endDate: FormControl<EhcFormRawValue['endDate']>;
  phone: FormControl<EhcFormRawValue['phone']>;
  fax: FormControl<EhcFormRawValue['fax']>;
  email: FormControl<EhcFormRawValue['email']>;
  clientId: FormControl<EhcFormRawValue['clientId']>;
  addressId: FormControl<EhcFormRawValue['addressId']>;
  coverages: FormControl<EhcFormRawValue['coverages']>;
  ehcClient: FormControl<EhcFormRawValue['ehcClient']>;
  dependents: FormControl<EhcFormRawValue['dependents']>;
  createdDate: FormControl<EhcFormRawValue['createdDate']>;
  createdBy: FormControl<EhcFormRawValue['createdBy']>;
  lastModifiedBy: FormControl<EhcFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<EhcFormRawValue['lastModifiedDate']>;
};

export type EhcFormGroup = FormGroup<EhcFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EhcFormService {
  createEhcFormGroup(ehc: EhcFormGroupInput = { id: null }): EhcFormGroup {
    const ehcRawValue = this.convertEhcToEhcRawValue({
      ...this.getFormDefaults(),
      ...ehc,
    });
    return new FormGroup<EhcFormGroupContent>(<EhcFormGroupContent>{
      id: new FormControl(
        { value: ehcRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      certificateNumber: new FormControl(ehcRawValue.certificateNumber, {
        validators: [Validators.maxLength(50)],
      }),
      policyNumber: new FormControl(ehcRawValue.policyNumber, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      policyHolder: new FormControl(ehcRawValue.policyHolder, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      groupNumber: new FormControl(ehcRawValue.groupNumber, {
        validators: [Validators.maxLength(50)],
      }),
      name: new FormControl(ehcRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      note: new FormControl(ehcRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      type: new FormControl(ehcRawValue.type, {
        validators: [Validators.maxLength(50)],
      }),
      status: new FormControl(ehcRawValue.status, {
        validators: [Validators.maxLength(50)],
      }),
      endDate: new FormControl(ehcRawValue.endDate),
      phone: new FormControl(ehcRawValue.phone, {
        validators: [Validators.maxLength(15)],
      }),
      fax: new FormControl(ehcRawValue.fax, {
        validators: [Validators.maxLength(15)],
      }),
      email: new FormControl(ehcRawValue.email, {
        validators: [Validators.maxLength(320)],
      }),
      clientId: new FormControl(ehcRawValue.clientId, {
        validators: [Validators.required],
      }),
      addressId: new FormControl(ehcRawValue.addressId),
      coverages: new FormControl(ehcRawValue.coverages),
      ehcClient: new FormControl(ehcRawValue.ehcClient),
      dependents: new FormControl(ehcRawValue.dependents),
      createdDate: new FormControl(ehcRawValue.createdDate),
      createdBy: new FormControl(ehcRawValue.createdBy),
      lastModifiedBy: new FormControl(ehcRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(ehcRawValue.lastModifiedDate),
    });
  }

  getEhc(form: EhcFormGroup): Ehc | NewEhc {
    return this.convertEhcRawValueToEhc(form.getRawValue() as EhcFormRawValue | NewEhcFormRawValue);
  }

  resetForm(form: EhcFormGroup, ehc: EhcFormGroupInput): void {
    const ehcRawValue = this.convertEhcToEhcRawValue({ ...this.getFormDefaults(), ...ehc });
    form.reset(
      {
        ...ehcRawValue,
        id: { value: ehcRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EhcFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      endDate: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertEhcRawValueToEhc(rawEhc: EhcFormRawValue | NewEhcFormRawValue): Ehc | NewEhc {
    return {
      ...rawEhc,
      endDate: dayjs(rawEhc.endDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawEhc.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawEhc.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertEhcToEhcRawValue(
    ehc: Ehc | (Partial<NewEhc> & EhcFormDefaults),
  ): EhcFormRawValue | PartialWithRequiredKeyOf<NewEhcFormRawValue> {
    return {
      ...ehc,
      endDate: ehc.endDate ? ehc.endDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: ehc.createdDate ? ehc.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: ehc.lastModifiedDate ? ehc.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
