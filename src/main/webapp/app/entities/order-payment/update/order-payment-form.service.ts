import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { OrderPayment, NewOrderPayment } from '../order-payment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts OrderPayment for edit and NewOrderPaymentFormGroupInput for create.
 */
type OrderPaymentFormGroupInput = OrderPayment | PartialWithRequiredKeyOf<NewOrderPayment>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends OrderPayment | NewOrderPayment> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type OrderPaymentFormRawValue = FormValueOf<OrderPayment>;

type NewOrderPaymentFormRawValue = FormValueOf<NewOrderPayment>;

type OrderPaymentFormDefaults = Pick<NewOrderPayment, 'id' | 'createdDate' | 'lastModifiedDate'>;

type OrderPaymentFormGroupContent = {
  id: FormControl<OrderPaymentFormRawValue['id'] | NewOrderPayment['id']>;
  orderId: FormControl<OrderPaymentFormRawValue['orderId']>;
  totalPrice: FormControl<OrderPaymentFormRawValue['totalPrice']>;
  credit: FormControl<OrderPaymentFormRawValue['credit']>;
  debit: FormControl<OrderPaymentFormRawValue['debit']>;
  eTransfer: FormControl<OrderPaymentFormRawValue['eTransfer']>;
  moneyEmail: FormControl<OrderPaymentFormRawValue['moneyEmail']>;
  directDeposit: FormControl<OrderPaymentFormRawValue['directDeposit']>;
  cash: FormControl<OrderPaymentFormRawValue['cash']>;
  cheque: FormControl<OrderPaymentFormRawValue['cheque']>;
  createdBy: FormControl<OrderPaymentFormRawValue['createdBy']>;
  createdDate: FormControl<OrderPaymentFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<OrderPaymentFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<OrderPaymentFormRawValue['lastModifiedDate']>;
};

export type OrderPaymentFormGroup = FormGroup<OrderPaymentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OrderPaymentFormService {
  createOrderPaymentFormGroup(orderPayment: OrderPaymentFormGroupInput = { id: null }): OrderPaymentFormGroup {
    const orderPaymentRawValue = this.convertOrderPaymentToOrderPaymentRawValue({
      ...this.getFormDefaults(),
      ...orderPayment,
    });
    return new FormGroup<OrderPaymentFormGroupContent>({
      id: new FormControl(
        { value: orderPaymentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      orderId: new FormControl(orderPaymentRawValue.orderId, {
        validators: [Validators.required],
      }),
      totalPrice: new FormControl(orderPaymentRawValue.totalPrice, {
        validators: [Validators.required],
      }),
      credit: new FormControl(orderPaymentRawValue.credit),
      debit: new FormControl(orderPaymentRawValue.debit),
      eTransfer: new FormControl(orderPaymentRawValue.eTransfer),
      moneyEmail: new FormControl(orderPaymentRawValue.moneyEmail),
      directDeposit: new FormControl(orderPaymentRawValue.directDeposit),
      cash: new FormControl(orderPaymentRawValue.cash),
      cheque: new FormControl(orderPaymentRawValue.cheque),
      createdBy: new FormControl(orderPaymentRawValue.createdBy),
      createdDate: new FormControl(orderPaymentRawValue.createdDate),
      lastModifiedBy: new FormControl(orderPaymentRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(orderPaymentRawValue.lastModifiedDate),
    });
  }

  getOrderPayment(form: OrderPaymentFormGroup): OrderPayment | NewOrderPayment {
    return this.convertOrderPaymentRawValueToOrderPayment(form.getRawValue() as OrderPaymentFormRawValue | NewOrderPaymentFormRawValue);
  }

  resetForm(form: OrderPaymentFormGroup, orderPayment: OrderPaymentFormGroupInput): void {
    const orderPaymentRawValue = this.convertOrderPaymentToOrderPaymentRawValue({ ...this.getFormDefaults(), ...orderPayment });
    form.reset(
      {
        ...orderPaymentRawValue,
        id: { value: orderPaymentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): OrderPaymentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertOrderPaymentRawValueToOrderPayment(
    rawOrderPayment: OrderPaymentFormRawValue | NewOrderPaymentFormRawValue,
  ): OrderPayment | NewOrderPayment {
    return {
      ...rawOrderPayment,
      createdDate: dayjs(rawOrderPayment.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawOrderPayment.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertOrderPaymentToOrderPaymentRawValue(
    orderPayment: OrderPayment | (Partial<NewOrderPayment> & OrderPaymentFormDefaults),
  ): OrderPaymentFormRawValue | PartialWithRequiredKeyOf<NewOrderPaymentFormRawValue> {
    return {
      ...orderPayment,
      createdDate: orderPayment.createdDate ? orderPayment.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: orderPayment.lastModifiedDate ? orderPayment.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
