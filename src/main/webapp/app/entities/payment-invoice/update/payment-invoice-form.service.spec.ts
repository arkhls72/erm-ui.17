import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../payment-invoice.test-samples';

import { PaymentInvoiceFormService } from './payment-invoice-form.service';

describe('PaymentInvoice Form Service', () => {
  let service: PaymentInvoiceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentInvoiceFormService);
  });

  describe('Service methods', () => {
    describe('createPaymentInvoiceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPaymentInvoiceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            invoiceId: expect.any(Object),
            dueNow: expect.any(Object),
            status: expect.any(Object),
            note: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing PaymentInvoice should create a new form with FormGroup', () => {
        const formGroup = service.createPaymentInvoiceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            invoiceId: expect.any(Object),
            dueNow: expect.any(Object),
            status: expect.any(Object),
            note: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getPaymentInvoice', () => {
      it('should return NewPaymentInvoice for default PaymentInvoice initial value', () => {
        const formGroup = service.createPaymentInvoiceFormGroup(sampleWithNewData);

        const paymentInvoice = service.getPaymentInvoice(formGroup) as any;

        expect(paymentInvoice).toMatchObject(sampleWithNewData);
      });

      it('should return NewPaymentInvoice for empty PaymentInvoice initial value', () => {
        const formGroup = service.createPaymentInvoiceFormGroup();

        const paymentInvoice = service.getPaymentInvoice(formGroup) as any;

        expect(paymentInvoice).toMatchObject({});
      });

      it('should return PaymentInvoice', () => {
        const formGroup = service.createPaymentInvoiceFormGroup(sampleWithRequiredData);

        const paymentInvoice = service.getPaymentInvoice(formGroup) as any;

        expect(paymentInvoice).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing PaymentInvoice should not enable id FormControl', () => {
        const formGroup = service.createPaymentInvoiceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPaymentInvoice should disable id FormControl', () => {
        const formGroup = service.createPaymentInvoiceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
