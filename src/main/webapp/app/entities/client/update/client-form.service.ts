import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Client, NewClient } from '../client.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Client for edit and NewClientFormGroupInput for create.
 */
type ClientFormGroupInput = Client | PartialWithRequiredKeyOf<NewClient>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Client | NewClient> = Omit<T, 'birthDate' | 'createdDate' | 'lastModifiedDate'> & {
  birthDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ClientFormRawValue = FormValueOf<Client>;

type NewClientFormRawValue = FormValueOf<NewClient>;

type ClientFormDefaults = Pick<NewClient, 'id' | 'birthDate' | 'createdDate' | 'lastModifiedDate'>;

type ClientFormGroupContent = {
  id: FormControl<ClientFormRawValue['id'] | NewClient['id']>;
  firstName: FormControl<ClientFormRawValue['firstName']>;
  lastName: FormControl<ClientFormRawValue['lastName']>;
  birthDate: FormControl<ClientFormRawValue['birthDate']>;
  homePhone: FormControl<ClientFormRawValue['homePhone']>;
  cellPhone: FormControl<ClientFormRawValue['cellPhone']>;
  email: FormControl<ClientFormRawValue['email']>;
  addressId: FormControl<ClientFormRawValue['address']>;
  gender: FormControl<ClientFormRawValue['gender']>;
  howHear: FormControl<ClientFormRawValue['howHear']>;
  emergencyName: FormControl<ClientFormRawValue['emergencyName']>;
  emergencyPhone: FormControl<ClientFormRawValue['emergencyPhone']>;
  createdDate: FormControl<ClientFormRawValue['createdDate']>;
  createdBy: FormControl<ClientFormRawValue['createdBy']>;
  lastModifiedDate: FormControl<ClientFormRawValue['lastModifiedDate']>;
  lastModifiedBy: FormControl<ClientFormRawValue['lastModifiedBy']>;
  phoneExtension: FormControl<ClientFormRawValue['phoneExtension']>;
};

export type ClientFormGroup = FormGroup<ClientFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClientFormService {
  createClientFormGroup(client: ClientFormGroupInput = { id: null }): ClientFormGroup {
    const clientRawValue = this.convertClientToClientRawValue({
      ...this.getFormDefaults(),
      ...client,
    });
    return new FormGroup<ClientFormGroupContent>({
      id: new FormControl(
        { value: clientRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      firstName: new FormControl(clientRawValue.firstName, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      lastName: new FormControl(clientRawValue.lastName, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      birthDate: new FormControl(clientRawValue.birthDate),
      homePhone: new FormControl(clientRawValue.homePhone),
      cellPhone: new FormControl(clientRawValue.cellPhone, {
        validators: [Validators.required, Validators.minLength(12), Validators.maxLength(15)],
      }),
      email: new FormControl(clientRawValue.email, {
        validators: [Validators.maxLength(320)],
      }),
      addressId: new FormControl(clientRawValue.address),
      gender: new FormControl(clientRawValue.gender, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      howHear: new FormControl(clientRawValue.howHear, {
        validators: [Validators.maxLength(50)],
      }),
      emergencyName: new FormControl(clientRawValue.emergencyName, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      emergencyPhone: new FormControl(clientRawValue.emergencyPhone, {
        validators: [Validators.required, Validators.minLength(12), Validators.maxLength(15)],
      }),
      createdDate: new FormControl(clientRawValue.createdDate),
      createdBy: new FormControl(clientRawValue.createdBy),
      lastModifiedDate: new FormControl(clientRawValue.lastModifiedDate),
      lastModifiedBy: new FormControl(clientRawValue.lastModifiedBy),
      phoneExtension: new FormControl(clientRawValue.phoneExtension, {
        validators: [Validators.maxLength(12)],
      }),
    });
  }

  getClient(form: ClientFormGroup): Client | NewClient {
    return this.convertClientRawValueToClient(form.getRawValue() as ClientFormRawValue | NewClientFormRawValue);
  }

  resetForm(form: ClientFormGroup, client: ClientFormGroupInput): void {
    const clientRawValue = this.convertClientToClientRawValue({ ...this.getFormDefaults(), ...client });
    form.reset(
      {
        ...clientRawValue,
        id: { value: clientRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ClientFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      birthDate: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertClientRawValueToClient(rawClient: ClientFormRawValue | NewClientFormRawValue): Client | NewClient {
    return {
      ...rawClient,
      birthDate: dayjs(rawClient.birthDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawClient.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawClient.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertClientToClientRawValue(
    client: Client | (Partial<NewClient> & ClientFormDefaults),
  ): ClientFormRawValue | PartialWithRequiredKeyOf<NewClientFormRawValue> {
    return {
      ...client,
      birthDate: client.birthDate ? client.birthDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: client.createdDate ? client.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: client.lastModifiedDate ? client.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
