import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ServiceInvoice, NewServiceInvoice } from '../service-invoice.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ServiceInvoice for edit and NewServiceInvoiceFormGroupInput for create.
 */
type ServiceInvoiceFormGroupInput = ServiceInvoice | PartialWithRequiredKeyOf<NewServiceInvoice>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ServiceInvoice | NewServiceInvoice> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ServiceInvoiceFormRawValue = FormValueOf<ServiceInvoice>;

type NewServiceInvoiceFormRawValue = FormValueOf<NewServiceInvoice>;

type ServiceInvoiceFormDefaults = Pick<NewServiceInvoice, 'id' | 'createdDate' | 'lastModifiedDate'>;

type ServiceInvoiceFormGroupContent = {
  id: FormControl<ServiceInvoiceFormRawValue['id'] | NewServiceInvoice['id']>;
  invoiceId: FormControl<ServiceInvoiceFormRawValue['invoiceId']>;
  invoicePrice: FormControl<ServiceInvoiceFormRawValue['invoicePrice']>;
  myServiceId: FormControl<ServiceInvoiceFormRawValue['myServiceId']>;
  myServiceFeeId: FormControl<ServiceInvoiceFormRawValue['myServiceFeeId']>;
  quantity: FormControl<ServiceInvoiceFormRawValue['quantity']>;
  status: FormControl<ServiceInvoiceFormRawValue['status']>;
  createdDate: FormControl<ServiceInvoiceFormRawValue['createdDate']>;
  createdBy: FormControl<ServiceInvoiceFormRawValue['createdBy']>;
  lastModifiedDate: FormControl<ServiceInvoiceFormRawValue['lastModifiedDate']>;
  lastModifiedBy: FormControl<ServiceInvoiceFormRawValue['lastModifiedBy']>;
};

export type ServiceInvoiceFormGroup = FormGroup<ServiceInvoiceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ServiceInvoiceFormService {
  createServiceInvoiceFormGroup(serviceInvoice: ServiceInvoiceFormGroupInput = { id: null }): ServiceInvoiceFormGroup {
    const serviceInvoiceRawValue = this.convertServiceInvoiceToServiceInvoiceRawValue({
      ...this.getFormDefaults(),
      ...serviceInvoice,
    });
    return new FormGroup<ServiceInvoiceFormGroupContent>({
      id: new FormControl(
        { value: serviceInvoiceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      invoiceId: new FormControl(serviceInvoiceRawValue.invoiceId, {
        validators: [Validators.required],
      }),
      invoicePrice: new FormControl(serviceInvoiceRawValue.invoicePrice, {
        validators: [Validators.required],
      }),
      myServiceId: new FormControl(serviceInvoiceRawValue.myServiceId, {
        validators: [Validators.required],
      }),
      myServiceFeeId: new FormControl(serviceInvoiceRawValue.myServiceFeeId, {
        validators: [Validators.required],
      }),
      quantity: new FormControl(serviceInvoiceRawValue.quantity, {
        validators: [Validators.required],
      }),
      status: new FormControl(serviceInvoiceRawValue.status, {
        validators: [Validators.required],
      }),
      createdDate: new FormControl(serviceInvoiceRawValue.createdDate),
      createdBy: new FormControl(serviceInvoiceRawValue.createdBy),
      lastModifiedDate: new FormControl(serviceInvoiceRawValue.lastModifiedDate),
      lastModifiedBy: new FormControl(serviceInvoiceRawValue.lastModifiedBy),
    });
  }

  getServiceInvoice(form: ServiceInvoiceFormGroup): ServiceInvoice | NewServiceInvoice {
    return this.convertServiceInvoiceRawValueToServiceInvoice(
      form.getRawValue() as ServiceInvoiceFormRawValue | NewServiceInvoiceFormRawValue,
    );
  }

  resetForm(form: ServiceInvoiceFormGroup, serviceInvoice: ServiceInvoiceFormGroupInput): void {
    const serviceInvoiceRawValue = this.convertServiceInvoiceToServiceInvoiceRawValue({ ...this.getFormDefaults(), ...serviceInvoice });
    form.reset(
      {
        ...serviceInvoiceRawValue,
        id: { value: serviceInvoiceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ServiceInvoiceFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertServiceInvoiceRawValueToServiceInvoice(
    rawServiceInvoice: ServiceInvoiceFormRawValue | NewServiceInvoiceFormRawValue,
  ): ServiceInvoice | NewServiceInvoice {
    return {
      ...rawServiceInvoice,
      createdDate: dayjs(rawServiceInvoice.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawServiceInvoice.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertServiceInvoiceToServiceInvoiceRawValue(
    serviceInvoice: ServiceInvoice | (Partial<NewServiceInvoice> & ServiceInvoiceFormDefaults),
  ): ServiceInvoiceFormRawValue | PartialWithRequiredKeyOf<NewServiceInvoiceFormRawValue> {
    return {
      ...serviceInvoice,
      createdDate: serviceInvoice.createdDate ? serviceInvoice.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: serviceInvoice.lastModifiedDate ? serviceInvoice.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
