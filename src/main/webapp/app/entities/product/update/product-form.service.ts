import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Product, NewProduct } from '../product.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Product for edit and NewProductFormGroupInput for create.
 */
type ProductFormGroupInput = Product | PartialWithRequiredKeyOf<NewProduct>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Product | NewProduct> = Omit<T, 'lastOrderDate' | 'createdDate' | 'lastModifiedDate'> & {
  lastOrderDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ProductFormRawValue = FormValueOf<Product>;

type NewProductFormRawValue = FormValueOf<NewProduct>;

type ProductFormDefaults = Pick<NewProduct, 'id' | 'lastOrderDate' | 'createdDate' | 'lastModifiedDate'>;

type ProductFormGroupContent = {
  id: FormControl<ProductFormRawValue['id'] | NewProduct['id']>;
  name: FormControl<ProductFormRawValue['name']>;
  description: FormControl<ProductFormRawValue['description']>;
  suppierId: FormControl<ProductFormRawValue['supplierId']>;
  quantity: FormControl<ProductFormRawValue['quantity']>;
  itemPrice: FormControl<ProductFormRawValue['itemPrice']>;
  note: FormControl<ProductFormRawValue['note']>;
  lastOrderDate: FormControl<ProductFormRawValue['lastOrderDate']>;
  createdBy: FormControl<ProductFormRawValue['createdBy']>;
  createdDate: FormControl<ProductFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ProductFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ProductFormRawValue['lastModifiedDate']>;
  emptyPrice: FormControl<ProductFormRawValue['emptyPrice']>;
};

export type ProductFormGroup = FormGroup<ProductFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductFormService {
  createProductFormGroup(product: ProductFormGroupInput = { id: null }): ProductFormGroup {
    const productRawValue = this.convertProductToProductRawValue({
      ...this.getFormDefaults(),
      ...product,
    });
    return new FormGroup<ProductFormGroupContent>({
      id: new FormControl(
        { value: productRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(productRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      description: new FormControl(productRawValue.description, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(250)],
      }),
      suppierId: new FormControl(productRawValue.supplierId, {
        validators: [Validators.required],
      }),
      quantity: new FormControl(productRawValue.quantity, {
        validators: [Validators.required],
      }),
      itemPrice: new FormControl(productRawValue.itemPrice, {
        validators: [Validators.required],
      }),
      note: new FormControl(productRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      lastOrderDate: new FormControl(productRawValue.lastOrderDate),
      createdBy: new FormControl(productRawValue.createdBy),
      createdDate: new FormControl(productRawValue.createdDate),
      lastModifiedBy: new FormControl(productRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(productRawValue.lastModifiedDate),
      emptyPrice: new FormControl(productRawValue.emptyPrice),
    });
  }

  getProduct(form: ProductFormGroup): Product | NewProduct {
    return this.convertProductRawValueToProduct(form.getRawValue() as ProductFormRawValue | NewProductFormRawValue);
  }

  resetForm(form: ProductFormGroup, product: ProductFormGroupInput): void {
    const productRawValue = this.convertProductToProductRawValue({ ...this.getFormDefaults(), ...product });
    form.reset(
      {
        ...productRawValue,
        id: { value: productRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProductFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      lastOrderDate: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertProductRawValueToProduct(rawProduct: ProductFormRawValue | NewProductFormRawValue): Product | NewProduct {
    return {
      ...rawProduct,
      lastOrderDate: dayjs(rawProduct.lastOrderDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawProduct.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawProduct.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertProductToProductRawValue(
    product: Product | (Partial<NewProduct> & ProductFormDefaults),
  ): ProductFormRawValue | PartialWithRequiredKeyOf<NewProductFormRawValue> {
    return {
      ...product,
      lastOrderDate: product.lastOrderDate ? product.lastOrderDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: product.createdDate ? product.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: product.lastModifiedDate ? product.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
