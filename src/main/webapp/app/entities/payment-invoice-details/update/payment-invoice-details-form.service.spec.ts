import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../payment-invoice-details.test-samples';

import { PaymentInvoiceDetailsFormService } from './payment-invoice-details-form.service';

describe('PaymentInvoiceDetails Form Service', () => {
  let service: PaymentInvoiceDetailsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentInvoiceDetailsFormService);
  });

  describe('Service methods', () => {
    describe('createPaymentInvoiceDetailsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPaymentInvoiceDetailsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            paymentInvoiceId: expect.any(Object),
            paymentAmount: expect.any(Object),
            paymentMethod: expect.any(Object),
            cardNumber: expect.any(Object),
            note: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing PaymentInvoiceDetails should create a new form with FormGroup', () => {
        const formGroup = service.createPaymentInvoiceDetailsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            paymentInvoiceId: expect.any(Object),
            paymentAmount: expect.any(Object),
            paymentMethod: expect.any(Object),
            cardNumber: expect.any(Object),
            note: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getPaymentInvoiceDetails', () => {
      it('should return NewPaymentInvoiceDetails for default PaymentInvoiceDetails initial value', () => {
        const formGroup = service.createPaymentInvoiceDetailsFormGroup(sampleWithNewData);

        const paymentInvoiceDetails = service.getPaymentInvoiceDetails(formGroup) as any;

        expect(paymentInvoiceDetails).toMatchObject(sampleWithNewData);
      });

      it('should return NewPaymentInvoiceDetails for empty PaymentInvoiceDetails initial value', () => {
        const formGroup = service.createPaymentInvoiceDetailsFormGroup();

        const paymentInvoiceDetails = service.getPaymentInvoiceDetails(formGroup) as any;

        expect(paymentInvoiceDetails).toMatchObject({});
      });

      it('should return PaymentInvoiceDetails', () => {
        const formGroup = service.createPaymentInvoiceDetailsFormGroup(sampleWithRequiredData);

        const paymentInvoiceDetails = service.getPaymentInvoiceDetails(formGroup) as any;

        expect(paymentInvoiceDetails).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing PaymentInvoiceDetails should not enable id FormControl', () => {
        const formGroup = service.createPaymentInvoiceDetailsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPaymentInvoiceDetails should disable id FormControl', () => {
        const formGroup = service.createPaymentInvoiceDetailsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
