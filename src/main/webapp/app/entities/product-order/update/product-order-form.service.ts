import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ProductOrder, NewProductOrder } from '../product-order.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ProductOrder for edit and NewProductOrderFormGroupInput for create.
 */
type ProductOrderFormGroupInput = ProductOrder | PartialWithRequiredKeyOf<NewProductOrder>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ProductOrder | NewProductOrder> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ProductOrderFormRawValue = FormValueOf<ProductOrder>;

type NewProductOrderFormRawValue = FormValueOf<NewProductOrder>;

type ProductOrderFormDefaults = Pick<NewProductOrder, 'id' | 'createdDate' | 'lastModifiedDate'>;

type ProductOrderFormGroupContent = {
  id: FormControl<ProductOrderFormRawValue['id'] | NewProductOrder['id']>;
  myProductId: FormControl<ProductOrderFormRawValue['myProductId']>;
  orderId: FormControl<ProductOrderFormRawValue['orderId']>;
  orderPrice: FormControl<ProductOrderFormRawValue['orderPrice']>;
  quantity: FormControl<ProductOrderFormRawValue['quantity']>;
  status: FormControl<ProductOrderFormRawValue['status']>;
  createdBy: FormControl<ProductOrderFormRawValue['createdBy']>;
  createdDate: FormControl<ProductOrderFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ProductOrderFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ProductOrderFormRawValue['lastModifiedDate']>;
};

export type ProductOrderFormGroup = FormGroup<ProductOrderFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductOrderFormService {
  createProductOrderFormGroup(productOrder: ProductOrderFormGroupInput = { id: null }): ProductOrderFormGroup {
    const productOrderRawValue = this.convertProductOrderToProductOrderRawValue({
      ...this.getFormDefaults(),
      ...productOrder,
    });
    return new FormGroup<ProductOrderFormGroupContent>({
      id: new FormControl(
        { value: productOrderRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      myProductId: new FormControl(productOrderRawValue.myProductId, {
        validators: [Validators.required],
      }),
      orderId: new FormControl(productOrderRawValue.orderId, {
        validators: [Validators.required],
      }),
      orderPrice: new FormControl(productOrderRawValue.orderPrice, {
        validators: [Validators.required],
      }),
      quantity: new FormControl(productOrderRawValue.quantity, {
        validators: [Validators.required],
      }),
      status: new FormControl(productOrderRawValue.status, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      createdBy: new FormControl(productOrderRawValue.createdBy),
      createdDate: new FormControl(productOrderRawValue.createdDate),
      lastModifiedBy: new FormControl(productOrderRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(productOrderRawValue.lastModifiedDate),
    });
  }

  getProductOrder(form: ProductOrderFormGroup): ProductOrder | NewProductOrder {
    return this.convertProductOrderRawValueToProductOrder(form.getRawValue() as ProductOrderFormRawValue | NewProductOrderFormRawValue);
  }

  resetForm(form: ProductOrderFormGroup, productOrder: ProductOrderFormGroupInput): void {
    const productOrderRawValue = this.convertProductOrderToProductOrderRawValue({ ...this.getFormDefaults(), ...productOrder });
    form.reset(
      {
        ...productOrderRawValue,
        id: { value: productOrderRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProductOrderFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertProductOrderRawValueToProductOrder(
    rawProductOrder: ProductOrderFormRawValue | NewProductOrderFormRawValue,
  ): ProductOrder | NewProductOrder {
    return {
      ...rawProductOrder,
      createdDate: dayjs(rawProductOrder.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawProductOrder.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertProductOrderToProductOrderRawValue(
    productOrder: ProductOrder | (Partial<NewProductOrder> & ProductOrderFormDefaults),
  ): ProductOrderFormRawValue | PartialWithRequiredKeyOf<NewProductOrderFormRawValue> {
    return {
      ...productOrder,
      createdDate: productOrder.createdDate ? productOrder.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: productOrder.lastModifiedDate ? productOrder.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
