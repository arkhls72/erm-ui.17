import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ProductInvoice, NewProductInvoice } from '../product-invoice.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ProductInvoice for edit and NewProductInvoiceFormGroupInput for create.
 */
type ProductInvoiceFormGroupInput = ProductInvoice | PartialWithRequiredKeyOf<NewProductInvoice>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ProductInvoice | NewProductInvoice> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ProductInvoiceFormRawValue = FormValueOf<ProductInvoice>;

type NewProductInvoiceFormRawValue = FormValueOf<NewProductInvoice>;

type ProductInvoiceFormDefaults = Pick<NewProductInvoice, 'id' | 'createdDate' | 'lastModifiedDate'>;

type ProductInvoiceFormGroupContent = {
  id: FormControl<ProductInvoiceFormRawValue['id'] | NewProductInvoice['id']>;
  invoiceId: FormControl<ProductInvoiceFormRawValue['invoiceId']>;
  myProductId: FormControl<ProductInvoiceFormRawValue['myProductId']>;
  myProductFeeId: FormControl<ProductInvoiceFormRawValue['myProductFeeId']>;
  invoicePrice: FormControl<ProductInvoiceFormRawValue['invoicePrice']>;
  quantity: FormControl<ProductInvoiceFormRawValue['quantity']>;
  status: FormControl<ProductInvoiceFormRawValue['status']>;
  createdBy: FormControl<ProductInvoiceFormRawValue['createdBy']>;
  createdDate: FormControl<ProductInvoiceFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ProductInvoiceFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ProductInvoiceFormRawValue['lastModifiedDate']>;
};

export type ProductInvoiceFormGroup = FormGroup<ProductInvoiceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductInvoiceFormService {
  createProductInvoiceFormGroup(productInvoice: ProductInvoiceFormGroupInput = { id: null }): ProductInvoiceFormGroup {
    const productInvoiceRawValue = this.convertProductInvoiceToProductInvoiceRawValue({
      ...this.getFormDefaults(),
      ...productInvoice,
    });
    return new FormGroup<ProductInvoiceFormGroupContent>({
      id: new FormControl(
        { value: productInvoiceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      invoiceId: new FormControl(productInvoiceRawValue.invoiceId, {
        validators: [Validators.required],
      }),
      myProductId: new FormControl(productInvoiceRawValue.myProductId, {
        validators: [Validators.required],
      }),
      myProductFeeId: new FormControl(productInvoiceRawValue.myProductFeeId, {
        validators: [Validators.required],
      }),
      invoicePrice: new FormControl(productInvoiceRawValue.invoicePrice, {
        validators: [Validators.required],
      }),
      quantity: new FormControl(productInvoiceRawValue.quantity, {
        validators: [Validators.required],
      }),
      status: new FormControl(productInvoiceRawValue.status, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      createdBy: new FormControl(productInvoiceRawValue.createdBy),
      createdDate: new FormControl(productInvoiceRawValue.createdDate),
      lastModifiedBy: new FormControl(productInvoiceRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(productInvoiceRawValue.lastModifiedDate),
    });
  }

  getProductInvoice(form: ProductInvoiceFormGroup): ProductInvoice | NewProductInvoice {
    return this.convertProductInvoiceRawValueToProductInvoice(
      form.getRawValue() as ProductInvoiceFormRawValue | NewProductInvoiceFormRawValue,
    );
  }

  resetForm(form: ProductInvoiceFormGroup, productInvoice: ProductInvoiceFormGroupInput): void {
    const productInvoiceRawValue = this.convertProductInvoiceToProductInvoiceRawValue({ ...this.getFormDefaults(), ...productInvoice });
    form.reset(
      {
        ...productInvoiceRawValue,
        id: { value: productInvoiceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProductInvoiceFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertProductInvoiceRawValueToProductInvoice(
    rawProductInvoice: ProductInvoiceFormRawValue | NewProductInvoiceFormRawValue,
  ): ProductInvoice | NewProductInvoice {
    return {
      ...rawProductInvoice,
      createdDate: dayjs(rawProductInvoice.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawProductInvoice.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertProductInvoiceToProductInvoiceRawValue(
    productInvoice: ProductInvoice | (Partial<NewProductInvoice> & ProductInvoiceFormDefaults),
  ): ProductInvoiceFormRawValue | PartialWithRequiredKeyOf<NewProductInvoiceFormRawValue> {
    return {
      ...productInvoice,
      createdDate: productInvoice.createdDate ? productInvoice.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: productInvoice.lastModifiedDate ? productInvoice.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
