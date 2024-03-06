import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../client-invoice.test-samples';

import { ClientInvoiceFormService } from './client-invoice-form.service';

describe('ClientInvoice Form Service', () => {
  let service: ClientInvoiceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientInvoiceFormService);
  });

  describe('Service methods', () => {
    describe('createClientInvoiceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createClientInvoiceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            invoiceId: expect.any(Object),
            invoicePrice: expect.any(Object),
            productId: expect.any(Object),
            myServiceId: expect.any(Object),
            quantity: expect.any(Object),
            status: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing ClientInvoice should create a new form with FormGroup', () => {
        const formGroup = service.createClientInvoiceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            invoiceId: expect.any(Object),
            invoicePrice: expect.any(Object),
            productId: expect.any(Object),
            myServiceId: expect.any(Object),
            quantity: expect.any(Object),
            status: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getClientInvoice', () => {
      it('should return NewClientInvoice for default ClientInvoice initial value', () => {
        const formGroup = service.createClientInvoiceFormGroup(sampleWithNewData);

        const clientInvoice = service.getClientInvoice(formGroup) as any;

        expect(clientInvoice).toMatchObject(sampleWithNewData);
      });

      it('should return NewClientInvoice for empty ClientInvoice initial value', () => {
        const formGroup = service.createClientInvoiceFormGroup();

        const clientInvoice = service.getClientInvoice(formGroup) as any;

        expect(clientInvoice).toMatchObject({});
      });

      it('should return ClientInvoice', () => {
        const formGroup = service.createClientInvoiceFormGroup(sampleWithRequiredData);

        const clientInvoice = service.getClientInvoice(formGroup) as any;

        expect(clientInvoice).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ClientInvoice should not enable id FormControl', () => {
        const formGroup = service.createClientInvoiceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClientInvoice should disable id FormControl', () => {
        const formGroup = service.createClientInvoiceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
