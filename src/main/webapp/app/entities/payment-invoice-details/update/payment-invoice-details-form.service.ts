import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { PaymentInvoiceDetails, NewPaymentInvoiceDetails } from '../payment-invoice-details.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts PaymentInvoiceDetails for edit and NewPaymentInvoiceDetailsFormGroupInput for create.
 */
type PaymentInvoiceDetailsFormGroupInput = PaymentInvoiceDetails | PartialWithRequiredKeyOf<NewPaymentInvoiceDetails>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends PaymentInvoiceDetails | NewPaymentInvoiceDetails> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type PaymentInvoiceDetailsFormRawValue = FormValueOf<PaymentInvoiceDetails>;

type NewPaymentInvoiceDetailsFormRawValue = FormValueOf<NewPaymentInvoiceDetails>;

type PaymentInvoiceDetailsFormDefaults = Pick<NewPaymentInvoiceDetails, 'id' | 'createdDate' | 'lastModifiedDate'>;

type PaymentInvoiceDetailsFormGroupContent = {
  id: FormControl<PaymentInvoiceDetailsFormRawValue['id'] | NewPaymentInvoiceDetails['id']>;
  paymentInvoiceId: FormControl<PaymentInvoiceDetailsFormRawValue['paymentInvoiceId']>;
  paymentAmount: FormControl<PaymentInvoiceDetailsFormRawValue['paymentAmount']>;
  paymentMethod: FormControl<PaymentInvoiceDetailsFormRawValue['paymentMethod']>;
  cardNumber: FormControl<PaymentInvoiceDetailsFormRawValue['cardNumber']>;
  note: FormControl<PaymentInvoiceDetailsFormRawValue['note']>;
  createdBy: FormControl<PaymentInvoiceDetailsFormRawValue['createdBy']>;
  createdDate: FormControl<PaymentInvoiceDetailsFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<PaymentInvoiceDetailsFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<PaymentInvoiceDetailsFormRawValue['lastModifiedDate']>;
};

export type PaymentInvoiceDetailsFormGroup = FormGroup<PaymentInvoiceDetailsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PaymentInvoiceDetailsFormService {
  createPaymentInvoiceDetailsFormGroup(
    paymentInvoiceDetails: PaymentInvoiceDetailsFormGroupInput = { id: null },
  ): PaymentInvoiceDetailsFormGroup {
    const paymentInvoiceDetailsRawValue = this.convertPaymentInvoiceDetailsToPaymentInvoiceDetailsRawValue({
      ...this.getFormDefaults(),
      ...paymentInvoiceDetails,
    });
    return new FormGroup<PaymentInvoiceDetailsFormGroupContent>({
      id: new FormControl(
        { value: paymentInvoiceDetailsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      paymentInvoiceId: new FormControl(paymentInvoiceDetailsRawValue.paymentInvoiceId, {
        validators: [Validators.required],
      }),
      paymentAmount: new FormControl(paymentInvoiceDetailsRawValue.paymentAmount, {
        validators: [Validators.required],
      }),
      paymentMethod: new FormControl(paymentInvoiceDetailsRawValue.paymentMethod, {
        validators: [Validators.required, Validators.maxLength(15)],
      }),
      cardNumber: new FormControl(paymentInvoiceDetailsRawValue.cardNumber, {
        validators: [Validators.required, Validators.minLength(16), Validators.maxLength(16)],
      }),
      note: new FormControl(paymentInvoiceDetailsRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      createdBy: new FormControl(paymentInvoiceDetailsRawValue.createdBy),
      createdDate: new FormControl(paymentInvoiceDetailsRawValue.createdDate),
      lastModifiedBy: new FormControl(paymentInvoiceDetailsRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(paymentInvoiceDetailsRawValue.lastModifiedDate),
    });
  }

  getPaymentInvoiceDetails(form: PaymentInvoiceDetailsFormGroup): PaymentInvoiceDetails | NewPaymentInvoiceDetails {
    return this.convertPaymentInvoiceDetailsRawValueToPaymentInvoiceDetails(
      form.getRawValue() as PaymentInvoiceDetailsFormRawValue | NewPaymentInvoiceDetailsFormRawValue,
    );
  }

  resetForm(form: PaymentInvoiceDetailsFormGroup, paymentInvoiceDetails: PaymentInvoiceDetailsFormGroupInput): void {
    const paymentInvoiceDetailsRawValue = this.convertPaymentInvoiceDetailsToPaymentInvoiceDetailsRawValue({
      ...this.getFormDefaults(),
      ...paymentInvoiceDetails,
    });
    form.reset(
      {
        ...paymentInvoiceDetailsRawValue,
        id: { value: paymentInvoiceDetailsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PaymentInvoiceDetailsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertPaymentInvoiceDetailsRawValueToPaymentInvoiceDetails(
    rawPaymentInvoiceDetails: PaymentInvoiceDetailsFormRawValue | NewPaymentInvoiceDetailsFormRawValue,
  ): PaymentInvoiceDetails | NewPaymentInvoiceDetails {
    return {
      ...rawPaymentInvoiceDetails,
      createdDate: dayjs(rawPaymentInvoiceDetails.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawPaymentInvoiceDetails.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertPaymentInvoiceDetailsToPaymentInvoiceDetailsRawValue(
    paymentInvoiceDetails: PaymentInvoiceDetails | (Partial<NewPaymentInvoiceDetails> & PaymentInvoiceDetailsFormDefaults),
  ): PaymentInvoiceDetailsFormRawValue | PartialWithRequiredKeyOf<NewPaymentInvoiceDetailsFormRawValue> {
    return {
      ...paymentInvoiceDetails,
      createdDate: paymentInvoiceDetails.createdDate ? paymentInvoiceDetails.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: paymentInvoiceDetails.lastModifiedDate
        ? paymentInvoiceDetails.lastModifiedDate.format(DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
