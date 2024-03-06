import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Address, NewAddress } from '../address.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Address for edit and NewAddressFormGroupInput for create.
 */
type AddressFormGroupInput = Address | PartialWithRequiredKeyOf<NewAddress>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Address | NewAddress> = Omit<T, 'lastModifiedDate' | 'createdDate'> & {
  lastModifiedDate?: string | null;
  createdDate?: string | null;
};

type AddressFormRawValue = FormValueOf<Address>;

type NewAddressFormRawValue = FormValueOf<NewAddress>;

type AddressFormDefaults = Pick<NewAddress, 'id' | 'lastModifiedDate' | 'createdDate'>;

type AddressFormGroupContent = {
  id: FormControl<AddressFormRawValue['id'] | NewAddress['id']>;
  streetNumber: FormControl<AddressFormRawValue['streetNumber']>;
  streetName: FormControl<AddressFormRawValue['streetName']>;
  unitNumber: FormControl<AddressFormRawValue['unitNumber']>;
  postalCode: FormControl<AddressFormRawValue['postalCode']>;
  city: FormControl<AddressFormRawValue['city']>;
  province: FormControl<AddressFormRawValue['province']>;
  countries: FormControl<AddressFormRawValue['countries']>;
  poBox: FormControl<AddressFormRawValue['poBox']>;
  lastModifiedBy: FormControl<AddressFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<AddressFormRawValue['lastModifiedDate']>;
  createdDate: FormControl<AddressFormRawValue['createdDate']>;
  createdBy: FormControl<AddressFormRawValue['createdBy']>;
};

export type AddressFormGroup = FormGroup<AddressFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AddressFormService {
  createAddressFormGroup(address: AddressFormGroupInput = { id: null }): AddressFormGroup {
    const addressRawValue = this.convertAddressToAddressRawValue({
      ...this.getFormDefaults(),
      ...address,
    });
    return new FormGroup<AddressFormGroupContent>({
      id: new FormControl(
        { value: addressRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      streetNumber: new FormControl(addressRawValue.streetNumber, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(10)],
      }),
      streetName: new FormControl(addressRawValue.streetName, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(15)],
      }),
      unitNumber: new FormControl(addressRawValue.unitNumber, {
        validators: [Validators.maxLength(10)],
      }),
      postalCode: new FormControl(addressRawValue.postalCode, {
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      }),
      city: new FormControl(addressRawValue.city, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(15)],
      }),
      province: new FormControl(addressRawValue.province, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(15)],
      }),
      countries: new FormControl(addressRawValue.countries),
      poBox: new FormControl(addressRawValue.poBox, {
        validators: [Validators.maxLength(25)],
      }),
      lastModifiedBy: new FormControl(addressRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(addressRawValue.lastModifiedDate),
      createdDate: new FormControl(addressRawValue.createdDate),
      createdBy: new FormControl(addressRawValue.createdBy),
    });
  }

  getAddress(form: AddressFormGroup): Address | NewAddress {
    return this.convertAddressRawValueToAddress(form.getRawValue() as AddressFormRawValue | NewAddressFormRawValue);
  }

  resetForm(form: AddressFormGroup, address: AddressFormGroupInput): void {
    const addressRawValue = this.convertAddressToAddressRawValue({ ...this.getFormDefaults(), ...address });
    form.reset(
      {
        ...addressRawValue,
        id: { value: addressRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AddressFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      lastModifiedDate: currentTime,
      createdDate: currentTime,
    };
  }

  private convertAddressRawValueToAddress(rawAddress: AddressFormRawValue | NewAddressFormRawValue): Address | NewAddress {
    return {
      ...rawAddress,
      lastModifiedDate: dayjs(rawAddress.lastModifiedDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawAddress.createdDate, DATE_TIME_FORMAT),
    };
  }

  private convertAddressToAddressRawValue(
    address: Address | (Partial<NewAddress> & AddressFormDefaults),
  ): AddressFormRawValue | PartialWithRequiredKeyOf<NewAddressFormRawValue> {
    return {
      ...address,
      lastModifiedDate: address.lastModifiedDate ? address.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: address.createdDate ? address.createdDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
