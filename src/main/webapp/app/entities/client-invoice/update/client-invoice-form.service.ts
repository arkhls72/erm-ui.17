import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ClientInvoice, NewClientInvoice } from '../client-invoice.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ClientInvoice for edit and NewClientInvoiceFormGroupInput for create.
 */
type ClientInvoiceFormGroupInput = ClientInvoice | PartialWithRequiredKeyOf<NewClientInvoice>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ClientInvoice | NewClientInvoice> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ClientInvoiceFormRawValue = FormValueOf<ClientInvoice>;

type NewClientInvoiceFormRawValue = FormValueOf<NewClientInvoice>;

type ClientInvoiceFormDefaults = Pick<NewClientInvoice, 'id' | 'createdDate' | 'lastModifiedDate'>;

type ClientInvoiceFormGroupContent = {
  id: FormControl<ClientInvoiceFormRawValue['id'] | NewClientInvoice['id']>;
  invoiceId: FormControl<ClientInvoiceFormRawValue['invoiceId']>;
  invoicePrice: FormControl<ClientInvoiceFormRawValue['invoicePrice']>;
  productId: FormControl<ClientInvoiceFormRawValue['productId']>;
  myServiceId: FormControl<ClientInvoiceFormRawValue['myServiceId']>;
  quantity: FormControl<ClientInvoiceFormRawValue['quantity']>;
  status: FormControl<ClientInvoiceFormRawValue['status']>;
  createdBy: FormControl<ClientInvoiceFormRawValue['createdBy']>;
  createdDate: FormControl<ClientInvoiceFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ClientInvoiceFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ClientInvoiceFormRawValue['lastModifiedDate']>;
};

export type ClientInvoiceFormGroup = FormGroup<ClientInvoiceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClientInvoiceFormService {
  createClientInvoiceFormGroup(clientInvoice: ClientInvoiceFormGroupInput = { id: null }): ClientInvoiceFormGroup {
    const clientInvoiceRawValue = this.convertClientInvoiceToClientInvoiceRawValue({
      ...this.getFormDefaults(),
      ...clientInvoice,
    });
    return new FormGroup<ClientInvoiceFormGroupContent>({
      id: new FormControl(
        { value: clientInvoiceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      invoiceId: new FormControl(clientInvoiceRawValue.invoiceId, {
        validators: [Validators.required],
      }),
      invoicePrice: new FormControl(clientInvoiceRawValue.invoicePrice, {
        validators: [Validators.required],
      }),
      productId: new FormControl(clientInvoiceRawValue.productId),
      myServiceId: new FormControl(clientInvoiceRawValue.myServiceId),
      quantity: new FormControl(clientInvoiceRawValue.quantity, {
        validators: [Validators.required],
      }),
      status: new FormControl(clientInvoiceRawValue.status, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      createdBy: new FormControl(clientInvoiceRawValue.createdBy),
      createdDate: new FormControl(clientInvoiceRawValue.createdDate),
      lastModifiedBy: new FormControl(clientInvoiceRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(clientInvoiceRawValue.lastModifiedDate),
    });
  }

  getClientInvoice(form: ClientInvoiceFormGroup): ClientInvoice | NewClientInvoice {
    return this.convertClientInvoiceRawValueToClientInvoice(form.getRawValue() as ClientInvoiceFormRawValue | NewClientInvoiceFormRawValue);
  }

  resetForm(form: ClientInvoiceFormGroup, clientInvoice: ClientInvoiceFormGroupInput): void {
    const clientInvoiceRawValue = this.convertClientInvoiceToClientInvoiceRawValue({ ...this.getFormDefaults(), ...clientInvoice });
    form.reset(
      {
        ...clientInvoiceRawValue,
        id: { value: clientInvoiceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ClientInvoiceFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertClientInvoiceRawValueToClientInvoice(
    rawClientInvoice: ClientInvoiceFormRawValue | NewClientInvoiceFormRawValue,
  ): ClientInvoice | NewClientInvoice {
    return {
      ...rawClientInvoice,
      createdDate: dayjs(rawClientInvoice.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawClientInvoice.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertClientInvoiceToClientInvoiceRawValue(
    clientInvoice: ClientInvoice | (Partial<NewClientInvoice> & ClientInvoiceFormDefaults),
  ): ClientInvoiceFormRawValue | PartialWithRequiredKeyOf<NewClientInvoiceFormRawValue> {
    return {
      ...clientInvoice,
      createdDate: clientInvoice.createdDate ? clientInvoice.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: clientInvoice.lastModifiedDate ? clientInvoice.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
