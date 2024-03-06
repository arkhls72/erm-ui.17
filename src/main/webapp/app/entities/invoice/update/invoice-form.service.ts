import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Invoice, NewInvoice } from '../invoice.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Invoice for edit and NewInvoiceFormGroupInput for create.
 */
type InvoiceFormGroupInput = Invoice | PartialWithRequiredKeyOf<NewInvoice>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Invoice | NewInvoice> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type InvoiceFormRawValue = FormValueOf<Invoice>;

type NewInvoiceFormRawValue = FormValueOf<NewInvoice>;

type InvoiceFormDefaults = Pick<NewInvoice, 'id' | 'createdDate' | 'lastModifiedDate'>;

type InvoiceFormGroupContent = {
  id: FormControl<InvoiceFormRawValue['id'] | NewInvoice['id']>;
  clientId: FormControl<InvoiceFormRawValue['clientId']>;
  invoiceNumber: FormControl<InvoiceFormRawValue['invoiceNumber']>;
  clinicId: FormControl<InvoiceFormRawValue['clinicId']>;
  status: FormControl<InvoiceFormRawValue['status']>;
  taxTotal: FormControl<InvoiceFormRawValue['taxTotal']>;
  subTotal: FormControl<InvoiceFormRawValue['subTotal']>;
  note: FormControl<InvoiceFormRawValue['note']>;
  fullName: FormControl<InvoiceFormRawValue['fullName']>;
  grandTotal: FormControl<InvoiceFormRawValue['grandTotal']>;
  createdBy: FormControl<InvoiceFormRawValue['createdBy']>;
  createdDate: FormControl<InvoiceFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<InvoiceFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<InvoiceFormRawValue['lastModifiedDate']>;
};

export type InvoiceFormGroup = FormGroup<InvoiceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InvoiceFormService {
  createInvoiceFormGroup(invoice: InvoiceFormGroupInput = { id: null }): InvoiceFormGroup {
    const invoiceRawValue = this.convertInvoiceToInvoiceRawValue({
      ...this.getFormDefaults(),
      ...invoice,
    });
    return new FormGroup<InvoiceFormGroupContent>({
      id: new FormControl(
        { value: invoiceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      clientId: new FormControl(invoiceRawValue.clientId, {
        validators: [Validators.required],
      }),
      invoiceNumber: new FormControl(invoiceRawValue.invoiceNumber, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      clinicId: new FormControl(invoiceRawValue.clinicId, {
        validators: [Validators.required],
      }),
      status: new FormControl(invoiceRawValue.status, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      taxTotal: new FormControl(invoiceRawValue.taxTotal, {
        validators: [Validators.required],
      }),
      subTotal: new FormControl(invoiceRawValue.subTotal),
      note: new FormControl(invoiceRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      fullName: new FormControl(invoiceRawValue.fullName, {
        validators: [Validators.maxLength(50)],
      }),
      grandTotal: new FormControl(invoiceRawValue.grandTotal, {
        validators: [Validators.required],
      }),
      createdBy: new FormControl(invoiceRawValue.createdBy),
      createdDate: new FormControl(invoiceRawValue.createdDate),
      lastModifiedBy: new FormControl(invoiceRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(invoiceRawValue.lastModifiedDate),
    });
  }

  getInvoice(form: InvoiceFormGroup): Invoice | NewInvoice {
    return this.convertInvoiceRawValueToInvoice(form.getRawValue() as InvoiceFormRawValue | NewInvoiceFormRawValue);
  }

  resetForm(form: InvoiceFormGroup, invoice: InvoiceFormGroupInput): void {
    const invoiceRawValue = this.convertInvoiceToInvoiceRawValue({ ...this.getFormDefaults(), ...invoice });
    form.reset(
      {
        ...invoiceRawValue,
        id: { value: invoiceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InvoiceFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertInvoiceRawValueToInvoice(rawInvoice: InvoiceFormRawValue | NewInvoiceFormRawValue): Invoice | NewInvoice {
    return {
      ...rawInvoice,
      createdDate: dayjs(rawInvoice.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawInvoice.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertInvoiceToInvoiceRawValue(
    invoice: Invoice | (Partial<NewInvoice> & InvoiceFormDefaults),
  ): InvoiceFormRawValue | PartialWithRequiredKeyOf<NewInvoiceFormRawValue> {
    return {
      ...invoice,
      createdDate: invoice.createdDate ? invoice.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: invoice.lastModifiedDate ? invoice.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
