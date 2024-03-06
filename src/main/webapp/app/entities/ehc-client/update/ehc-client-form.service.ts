import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { EhcClient, NewEhcClient } from '../ehc-client.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts EhcClient for edit and NewEhcClientFormGroupInput for create.
 */
type EhcClientFormGroupInput = EhcClient | PartialWithRequiredKeyOf<NewEhcClient>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends EhcClient | NewEhcClient> = Omit<T, 'endDate' | 'removedDate' | 'lastModfiedDate' | 'createdDate'> & {
  endDate?: string | null;
  removedDate?: string | null;
  lastModfiedDate?: string | null;
  createdDate?: string | null;
};

type EhcClientFormRawValue = FormValueOf<EhcClient>;

type NewEhcClientFormRawValue = FormValueOf<NewEhcClient>;

type EhcClientFormDefaults = Pick<NewEhcClient, 'id' | 'endDate' | 'removedDate' | 'lastModifiedDate' | 'createdDate'>;

type EhcClientFormGroupContent = {
  id: FormControl<EhcClientFormRawValue['id'] | NewEhcClient['id']>;
  ehcType: FormControl<EhcClientFormRawValue['ehcType']>;
  policyHolder: FormControl<EhcClientFormRawValue['policyHolder']>;
  clientId: FormControl<EhcClientFormRawValue['clientId']>;
  ehcId: FormControl<EhcClientFormRawValue['ehcId']>;
  endDate: FormControl<EhcClientFormRawValue['endDate']>;
  ehcPrimaryId: FormControl<EhcClientFormRawValue['ehcPrimaryId']>;
  note: FormControl<EhcClientFormRawValue['note']>;
  relation: FormControl<EhcClientFormRawValue['relation']>;
  status: FormControl<EhcClientFormRawValue['status']>;
  removedDate: FormControl<EhcClientFormRawValue['removedDate']>;
  lastModfiedDate: FormControl<EhcClientFormRawValue['lastModfiedDate']>;
  lastModifiedBy: FormControl<EhcClientFormRawValue['lastModifiedBy']>;
  createdDate: FormControl<EhcClientFormRawValue['createdDate']>;
  createdBy: FormControl<EhcClientFormRawValue['createdBy']>;
};

export type EhcClientFormGroup = FormGroup<EhcClientFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EhcClientFormService {
  createEhcClientFormGroup(ehcClient: EhcClientFormGroupInput = { id: null }): EhcClientFormGroup {
    const ehcClientRawValue = this.convertEhcClientToEhcClientRawValue({
      ...this.getFormDefaults(),
      ...ehcClient,
    });
    return new FormGroup<EhcClientFormGroupContent>(<EhcClientFormGroupContent>{
      id: new FormControl(
        { value: ehcClientRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      ehcType: new FormControl(ehcClientRawValue.ehcType, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      policyHolder: new FormControl(ehcClientRawValue.policyHolder, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      clientId: new FormControl(ehcClientRawValue.clientId, {
        validators: [Validators.required],
      }),
      ehcId: new FormControl(ehcClientRawValue.ehcId, {
        validators: [Validators.required],
      }),
      endDate: new FormControl(ehcClientRawValue.endDate),
      ehcPrimaryId: new FormControl(ehcClientRawValue.ehcPrimaryId, {
        validators: [Validators.required],
      }),
      note: new FormControl(ehcClientRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      relation: new FormControl(ehcClientRawValue.relation, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      status: new FormControl(ehcClientRawValue.status),
      removedDate: new FormControl(ehcClientRawValue.removedDate),
      lastModfiedDate: new FormControl(ehcClientRawValue.lastModfiedDate),
      lastModifiedBy: new FormControl(ehcClientRawValue.lastModifiedBy),
      createdDate: new FormControl(ehcClientRawValue.createdDate),
      createdBy: new FormControl(ehcClientRawValue.createdBy),
    });
  }

  getEhcClient(form: EhcClientFormGroup): EhcClient | NewEhcClient {
    return this.convertEhcClientRawValueToEhcClient(form.getRawValue() as EhcClientFormRawValue | NewEhcClientFormRawValue);
  }

  resetForm(form: EhcClientFormGroup, ehcClient: EhcClientFormGroupInput): void {
    const ehcClientRawValue = this.convertEhcClientToEhcClientRawValue({ ...this.getFormDefaults(), ...ehcClient });
    form.reset(
      {
        ...ehcClientRawValue,
        id: { value: ehcClientRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EhcClientFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      endDate: currentTime,
      removedDate: currentTime,
      lastModifiedDate: currentTime,
      createdDate: currentTime,
    };
  }

  private convertEhcClientRawValueToEhcClient(rawEhcClient: EhcClientFormRawValue | NewEhcClientFormRawValue): EhcClient | NewEhcClient {
    return {
      ...rawEhcClient,
      endDate: dayjs(rawEhcClient.endDate, DATE_TIME_FORMAT),
      removedDate: dayjs(rawEhcClient.removedDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawEhcClient.lastModfiedDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawEhcClient.createdDate, DATE_TIME_FORMAT),
    };
  }

  private convertEhcClientToEhcClientRawValue(
    ehcClient: EhcClient | (Partial<NewEhcClient> & EhcClientFormDefaults),
  ): EhcClientFormRawValue | PartialWithRequiredKeyOf<NewEhcClientFormRawValue> {
    return {
      ...ehcClient,
      endDate: ehcClient.endDate ? ehcClient.endDate.format(DATE_TIME_FORMAT) : undefined,
      removedDate: ehcClient.removedDate ? ehcClient.removedDate.format(DATE_TIME_FORMAT) : undefined,
      lastModfiedDate: ehcClient.lastModifiedDate ? ehcClient.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: ehcClient.createdDate ? ehcClient.createdDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
