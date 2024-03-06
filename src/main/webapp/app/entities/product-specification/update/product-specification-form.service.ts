import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ProductSpecification, NewProductSpecification } from '../product-specification.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ProductSpecification for edit and NewProductSpecificationFormGroupInput for create.
 */
type ProductSpecificationFormGroupInput = ProductSpecification | PartialWithRequiredKeyOf<NewProductSpecification>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ProductSpecification | NewProductSpecification> = Omit<T, 'lastModifiedDate' | 'createdDate'> & {
  lastModifiedDate?: string | null;
  createdDate?: string | null;
};

type ProductSpecificationFormRawValue = FormValueOf<ProductSpecification>;

type NewProductSpecificationFormRawValue = FormValueOf<NewProductSpecification>;

type ProductSpecificationFormDefaults = Pick<NewProductSpecification, 'id' | 'lastModifiedDate' | 'createdDate'>;

type ProductSpecificationFormGroupContent = {
  id: FormControl<ProductSpecificationFormRawValue['id'] | NewProductSpecification['id']>;
  make: FormControl<ProductSpecificationFormRawValue['make']>;
  modelNumber: FormControl<ProductSpecificationFormRawValue['modelNumber']>;
  serialNumber: FormControl<ProductSpecificationFormRawValue['serialNumber']>;
  barcodeMediaId: FormControl<ProductSpecificationFormRawValue['barcodeMediaId']>;
  productId: FormControl<ProductSpecificationFormRawValue['productId']>;
  lastModifiedBy: FormControl<ProductSpecificationFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ProductSpecificationFormRawValue['lastModifiedDate']>;
  createdBy: FormControl<ProductSpecificationFormRawValue['createdBy']>;
  createdDate: FormControl<ProductSpecificationFormRawValue['createdDate']>;
};

export type ProductSpecificationFormGroup = FormGroup<ProductSpecificationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductSpecificationFormService {
  createProductSpecificationFormGroup(
    productSpecification: ProductSpecificationFormGroupInput = { id: null },
  ): ProductSpecificationFormGroup {
    const productSpecificationRawValue = this.convertProductSpecificationToProductSpecificationRawValue({
      ...this.getFormDefaults(),
      ...productSpecification,
    });
    return new FormGroup<ProductSpecificationFormGroupContent>({
      id: new FormControl(
        { value: productSpecificationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      make: new FormControl(productSpecificationRawValue.make, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      modelNumber: new FormControl(productSpecificationRawValue.modelNumber, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      serialNumber: new FormControl(productSpecificationRawValue.serialNumber, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      barcodeMediaId: new FormControl(productSpecificationRawValue.barcodeMediaId),
      productId: new FormControl(productSpecificationRawValue.productId, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(productSpecificationRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(productSpecificationRawValue.lastModifiedDate),
      createdBy: new FormControl(productSpecificationRawValue.createdBy),
      createdDate: new FormControl(productSpecificationRawValue.createdDate),
    });
  }

  getProductSpecification(form: ProductSpecificationFormGroup): ProductSpecification | NewProductSpecification {
    return this.convertProductSpecificationRawValueToProductSpecification(
      form.getRawValue() as ProductSpecificationFormRawValue | NewProductSpecificationFormRawValue,
    );
  }

  resetForm(form: ProductSpecificationFormGroup, productSpecification: ProductSpecificationFormGroupInput): void {
    const productSpecificationRawValue = this.convertProductSpecificationToProductSpecificationRawValue({
      ...this.getFormDefaults(),
      ...productSpecification,
    });
    form.reset(
      {
        ...productSpecificationRawValue,
        id: { value: productSpecificationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProductSpecificationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      lastModifiedDate: currentTime,
      createdDate: currentTime,
    };
  }

  private convertProductSpecificationRawValueToProductSpecification(
    rawProductSpecification: ProductSpecificationFormRawValue | NewProductSpecificationFormRawValue,
  ): ProductSpecification | NewProductSpecification {
    return {
      ...rawProductSpecification,
      lastModifiedDate: dayjs(rawProductSpecification.lastModifiedDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawProductSpecification.createdDate, DATE_TIME_FORMAT),
    };
  }

  private convertProductSpecificationToProductSpecificationRawValue(
    productSpecification: ProductSpecification | (Partial<NewProductSpecification> & ProductSpecificationFormDefaults),
  ): ProductSpecificationFormRawValue | PartialWithRequiredKeyOf<NewProductSpecificationFormRawValue> {
    return {
      ...productSpecification,
      lastModifiedDate: productSpecification.lastModifiedDate ? productSpecification.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: productSpecification.createdDate ? productSpecification.createdDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
