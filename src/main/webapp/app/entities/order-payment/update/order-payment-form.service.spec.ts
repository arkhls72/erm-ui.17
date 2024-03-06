import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../order-payment.test-samples';

import { OrderPaymentFormService } from './order-payment-form.service';

describe('OrderPayment Form Service', () => {
  let service: OrderPaymentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderPaymentFormService);
  });

  describe('Service methods', () => {
    describe('createOrderPaymentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOrderPaymentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            orderId: expect.any(Object),
            totalPrice: expect.any(Object),
            credit: expect.any(Object),
            debit: expect.any(Object),
            eTransfer: expect.any(Object),
            moneyEmail: expect.any(Object),
            directDeposit: expect.any(Object),
            cash: expect.any(Object),
            cheque: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing OrderPayment should create a new form with FormGroup', () => {
        const formGroup = service.createOrderPaymentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            orderId: expect.any(Object),
            totalPrice: expect.any(Object),
            credit: expect.any(Object),
            debit: expect.any(Object),
            eTransfer: expect.any(Object),
            moneyEmail: expect.any(Object),
            directDeposit: expect.any(Object),
            cash: expect.any(Object),
            cheque: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getOrderPayment', () => {
      it('should return NewOrderPayment for default OrderPayment initial value', () => {
        const formGroup = service.createOrderPaymentFormGroup(sampleWithNewData);

        const orderPayment = service.getOrderPayment(formGroup) as any;

        expect(orderPayment).toMatchObject(sampleWithNewData);
      });

      it('should return NewOrderPayment for empty OrderPayment initial value', () => {
        const formGroup = service.createOrderPaymentFormGroup();

        const orderPayment = service.getOrderPayment(formGroup) as any;

        expect(orderPayment).toMatchObject({});
      });

      it('should return OrderPayment', () => {
        const formGroup = service.createOrderPaymentFormGroup(sampleWithRequiredData);

        const orderPayment = service.getOrderPayment(formGroup) as any;

        expect(orderPayment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing OrderPayment should not enable id FormControl', () => {
        const formGroup = service.createOrderPaymentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOrderPayment should disable id FormControl', () => {
        const formGroup = service.createOrderPaymentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
