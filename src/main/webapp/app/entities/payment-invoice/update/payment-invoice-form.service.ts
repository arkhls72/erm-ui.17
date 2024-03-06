import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { PaymentInvoice, NewPaymentInvoice } from '../payment-invoice.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts PaymentInvoice for edit and NewPaymentInvoiceFormGroupInput for create.
 */
type PaymentInvoiceFormGroupInput = PaymentInvoice | PartialWithRequiredKeyOf<NewPaymentInvoice>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends PaymentInvoice | NewPaymentInvoice> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type PaymentInvoiceFormRawValue = FormValueOf<PaymentInvoice>;

type NewPaymentInvoiceFormRawValue = FormValueOf<NewPaymentInvoice>;

type PaymentInvoiceFormDefaults = Pick<NewPaymentInvoice, 'id' | 'createdDate' | 'lastModifiedDate'>;

type PaymentInvoiceFormGroupContent = {
  id: FormControl<PaymentInvoiceFormRawValue['id'] | NewPaymentInvoice['id']>;
  invoiceId: FormControl<PaymentInvoiceFormRawValue['invoiceId']>;
  dueNow: FormControl<PaymentInvoiceFormRawValue['dueNow']>;
  status: FormControl<PaymentInvoiceFormRawValue['status']>;
  note: FormControl<PaymentInvoiceFormRawValue['note']>;
  createdBy: FormControl<PaymentInvoiceFormRawValue['createdBy']>;
  createdDate: FormControl<PaymentInvoiceFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<PaymentInvoiceFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<PaymentInvoiceFormRawValue['lastModifiedDate']>;
};

export type PaymentInvoiceFormGroup = FormGroup<PaymentInvoiceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PaymentInvoiceFormService {
  createPaymentInvoiceFormGroup(paymentInvoice: PaymentInvoiceFormGroupInput = { id: null }): PaymentInvoiceFormGroup {
    const paymentInvoiceRawValue = this.convertPaymentInvoiceToPaymentInvoiceRawValue({
      ...this.getFormDefaults(),
      ...paymentInvoice,
    });
    return new FormGroup<PaymentInvoiceFormGroupContent>({
      id: new FormControl(
        { value: paymentInvoiceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      invoiceId: new FormControl(paymentInvoiceRawValue.invoiceId, {
        validators: [Validators.required],
      }),
      dueNow: new FormControl(paymentInvoiceRawValue.dueNow),
      status: new FormControl(paymentInvoiceRawValue.status, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      note: new FormControl(paymentInvoiceRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      createdBy: new FormControl(paymentInvoiceRawValue.createdBy),
      createdDate: new FormControl(paymentInvoiceRawValue.createdDate),
      lastModifiedBy: new FormControl(paymentInvoiceRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(paymentInvoiceRawValue.lastModifiedDate),
    });
  }

  getPaymentInvoice(form: PaymentInvoiceFormGroup): PaymentInvoice | NewPaymentInvoice {
    return this.convertPaymentInvoiceRawValueToPaymentInvoice(
      form.getRawValue() as PaymentInvoiceFormRawValue | NewPaymentInvoiceFormRawValue,
    );
  }

  resetForm(form: PaymentInvoiceFormGroup, paymentInvoice: PaymentInvoiceFormGroupInput): void {
    const paymentInvoiceRawValue = this.convertPaymentInvoiceToPaymentInvoiceRawValue({ ...this.getFormDefaults(), ...paymentInvoice });
    form.reset(
      {
        ...paymentInvoiceRawValue,
        id: { value: paymentInvoiceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PaymentInvoiceFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertPaymentInvoiceRawValueToPaymentInvoice(
    rawPaymentInvoice: PaymentInvoiceFormRawValue | NewPaymentInvoiceFormRawValue,
  ): PaymentInvoice | NewPaymentInvoice {
    return {
      ...rawPaymentInvoice,
      createdDate: dayjs(rawPaymentInvoice.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawPaymentInvoice.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertPaymentInvoiceToPaymentInvoiceRawValue(
    paymentInvoice: PaymentInvoice | (Partial<NewPaymentInvoice> & PaymentInvoiceFormDefaults),
  ): PaymentInvoiceFormRawValue | PartialWithRequiredKeyOf<NewPaymentInvoiceFormRawValue> {
    return {
      ...paymentInvoice,
      createdDate: paymentInvoice.createdDate ? paymentInvoice.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: paymentInvoice.lastModifiedDate ? paymentInvoice.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
