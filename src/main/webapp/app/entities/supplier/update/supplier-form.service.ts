import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Supplier, NewSupplier } from '../supplier.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Supplier for edit and NewSupplierFormGroupInput for create.
 */
type SupplierFormGroupInput = Supplier | PartialWithRequiredKeyOf<NewSupplier>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Supplier | NewSupplier> = Omit<T, 'lastModifiedDate'> & {
  lastModifiedDate?: string | null;
};

type SupplierFormRawValue = FormValueOf<Supplier>;

type NewSupplierFormRawValue = FormValueOf<NewSupplier>;

type SupplierFormDefaults = Pick<NewSupplier, 'id' | 'lastModifiedDate'>;

type SupplierFormGroupContent = {
  id: FormControl<SupplierFormRawValue['id'] | NewSupplier['id']>;
  name: FormControl<SupplierFormRawValue['name']>;
  contactName: FormControl<SupplierFormRawValue['contactName']>;
  phone: FormControl<SupplierFormRawValue['phone']>;
  addressId: FormControl<SupplierFormRawValue['addressId']>;
  email: FormControl<SupplierFormRawValue['email']>;
  lastModifiedBy: FormControl<SupplierFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<SupplierFormRawValue['lastModifiedDate']>;
};

export type SupplierFormGroup = FormGroup<SupplierFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SupplierFormService {
  createSupplierFormGroup(supplier: SupplierFormGroupInput = { id: null }): SupplierFormGroup {
    const supplierRawValue = this.convertSupplierToSupplierRawValue({
      ...this.getFormDefaults(),
      ...supplier,
    });
    return new FormGroup<SupplierFormGroupContent>({
      id: new FormControl(
        { value: supplierRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(supplierRawValue.name, {
        validators: [Validators.required, Validators.maxLength(25)],
      }),
      contactName: new FormControl(supplierRawValue.contactName, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      phone: new FormControl(supplierRawValue.phone, {
        validators: [Validators.maxLength(15)],
      }),
      addressId: new FormControl(supplierRawValue.addressId),
      email: new FormControl(supplierRawValue.email, {
        validators: [Validators.maxLength(320)],
      }),
      lastModifiedBy: new FormControl(supplierRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(supplierRawValue.lastModifiedDate),
    });
  }

  getSupplier(form: SupplierFormGroup): Supplier | NewSupplier {
    return this.convertSupplierRawValueToSupplier(form.getRawValue() as SupplierFormRawValue | NewSupplierFormRawValue);
  }

  resetForm(form: SupplierFormGroup, supplier: SupplierFormGroupInput): void {
    const supplierRawValue = this.convertSupplierToSupplierRawValue({ ...this.getFormDefaults(), ...supplier });
    form.reset(
      {
        ...supplierRawValue,
        id: { value: supplierRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SupplierFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      lastModifiedDate: currentTime,
    };
  }

  private convertSupplierRawValueToSupplier(rawSupplier: SupplierFormRawValue | NewSupplierFormRawValue): Supplier | NewSupplier {
    return {
      ...rawSupplier,
      lastModifiedDate: dayjs(rawSupplier.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertSupplierToSupplierRawValue(supplier: {
    lastModifiedDate?: dayjs.Dayjs | null;
    phone?: string | null;
    contactName?: string | null;
    lastModifiedBy?: string | null;
    name?: string | null;
    id: number | null;
    email?: string | null;
    addressId?: number | null;
  }): SupplierFormRawValue | PartialWithRequiredKeyOf<NewSupplierFormRawValue> {
    return {
      ...supplier,
      lastModifiedDate: supplier.lastModifiedDate ? supplier.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
