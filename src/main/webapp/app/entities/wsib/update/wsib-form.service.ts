import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Wsib, NewWsib } from '../wsib.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Wsib for edit and NewWsibFormGroupInput for create.
 */
type WsibFormGroupInput = Wsib | PartialWithRequiredKeyOf<NewWsib>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Wsib | NewWsib> = Omit<T, 'accidentDate' | 'closeDate' | 'lastModifiedDate'> & {
  accidentDate?: string | null;
  closeDate?: string | null;
  lastModifiedDate?: string | null;
};

type WsibFormRawValue = FormValueOf<Wsib>;

type NewWsibFormRawValue = FormValueOf<NewWsib>;

type WsibFormDefaults = Pick<NewWsib, 'id' | 'accidentDate' | 'closeDate' | 'lastModifiedDate'>;

type WsibFormGroupContent = {
  id: FormControl<WsibFormRawValue['id'] | NewWsib['id']>;
  employer: FormControl<WsibFormRawValue['employer']>;
  claimNumber: FormControl<WsibFormRawValue['claimNumber']>;
  clientId: FormControl<WsibFormRawValue['clientId']>;
  supervisor: FormControl<WsibFormRawValue['supervisor']>;
  accidentDate: FormControl<WsibFormRawValue['accidentDate']>;
  adjudicator: FormControl<WsibFormRawValue['adjudicator']>;
  caseManager: FormControl<WsibFormRawValue['caseManager']>;
  status: FormControl<WsibFormRawValue['status']>;
  phone: FormControl<WsibFormRawValue['phone']>;
  phoneExtension: FormControl<WsibFormRawValue['phoneExtension']>;
  cellPhone: FormControl<WsibFormRawValue['cellPhone']>;
  closeDate: FormControl<WsibFormRawValue['closeDate']>;
  note: FormControl<WsibFormRawValue['note']>;
  fax: FormControl<WsibFormRawValue['fax']>;
  coverages: FormControl<WsibFormRawValue['coverages']>;
  email: FormControl<WsibFormRawValue['email']>;
  addressId: FormControl<WsibFormRawValue['addressId']>;
  lastModifiedBy: FormControl<WsibFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<WsibFormRawValue['lastModifiedDate']>;
};

export type WsibFormGroup = FormGroup<WsibFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class WsibFormService {
  createWsibFormGroup(wsib: WsibFormGroupInput = { id: null }): WsibFormGroup {
    const wsibRawValue = this.convertWsibToWsibRawValue({
      ...this.getFormDefaults(),
      ...wsib,
    });
    return new FormGroup<WsibFormGroupContent>({
      id: new FormControl(
        { value: wsibRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      employer: new FormControl(wsibRawValue.employer, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      claimNumber: new FormControl(wsibRawValue.claimNumber, {
        validators: [Validators.maxLength(50)],
      }),
      clientId: new FormControl(wsibRawValue.clientId),
      supervisor: new FormControl(wsibRawValue.supervisor, {
        validators: [Validators.maxLength(50)],
      }),
      accidentDate: new FormControl(wsibRawValue.accidentDate, {
        validators: [Validators.required],
      }),
      adjudicator: new FormControl(wsibRawValue.adjudicator, {
        validators: [Validators.maxLength(50)],
      }),
      caseManager: new FormControl(wsibRawValue.caseManager, {
        validators: [Validators.maxLength(50)],
      }),
      status: new FormControl(wsibRawValue.status, {
        validators: [Validators.maxLength(15)],
      }),
      phone: new FormControl(wsibRawValue.phone, {
        validators: [Validators.maxLength(12)],
      }),
      phoneExtension: new FormControl(wsibRawValue.phoneExtension, {
        validators: [Validators.maxLength(10)],
      }),
      cellPhone: new FormControl(wsibRawValue.cellPhone, {
        validators: [Validators.maxLength(15)],
      }),
      closeDate: new FormControl(wsibRawValue.closeDate),
      note: new FormControl(wsibRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      fax: new FormControl(wsibRawValue.fax, {
        validators: [Validators.maxLength(12)],
      }),
      coverages: new FormControl(wsibRawValue.coverages),
      email: new FormControl(wsibRawValue.email, {
        validators: [Validators.maxLength(320)],
      }),
      addressId: new FormControl(wsibRawValue.addressId),
      lastModifiedBy: new FormControl(wsibRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(wsibRawValue.lastModifiedDate),
    });
  }

  getWsib(form: WsibFormGroup): Wsib | NewWsib {
    return this.convertWsibRawValueToWsib(form.getRawValue() as WsibFormRawValue | NewWsibFormRawValue);
  }

  resetForm(form: WsibFormGroup, wsib: WsibFormGroupInput): void {
    const wsibRawValue = this.convertWsibToWsibRawValue({ ...this.getFormDefaults(), ...wsib });
    form.reset(
      {
        ...wsibRawValue,
        id: { value: wsibRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): WsibFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      accidentDate: currentTime,
      closeDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertWsibRawValueToWsib(rawWsib: WsibFormRawValue | NewWsibFormRawValue): Wsib | NewWsib {
    return {
      ...rawWsib,
      accidentDate: dayjs(rawWsib.accidentDate, DATE_TIME_FORMAT),
      closeDate: dayjs(rawWsib.closeDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawWsib.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertWsibToWsibRawValue(
    wsib: Wsib | (Partial<NewWsib> & WsibFormDefaults),
  ): WsibFormRawValue | PartialWithRequiredKeyOf<NewWsibFormRawValue> {
    return {
      ...wsib,
      accidentDate: wsib.accidentDate ? wsib.accidentDate.format(DATE_TIME_FORMAT) : undefined,
      closeDate: wsib.closeDate ? wsib.closeDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: wsib.lastModifiedDate ? wsib.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
