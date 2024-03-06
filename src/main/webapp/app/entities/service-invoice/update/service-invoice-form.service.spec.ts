import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../service-invoice.test-samples';

import { ServiceInvoiceFormService } from './service-invoice-form.service';

describe('ServiceInvoice Form Service', () => {
  let service: ServiceInvoiceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceInvoiceFormService);
  });

  describe('Service methods', () => {
    describe('createServiceInvoiceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createServiceInvoiceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            invoiceId: expect.any(Object),
            invoicePrice: expect.any(Object),
            myServiceId: expect.any(Object),
            myServiceFeeId: expect.any(Object),
            quantity: expect.any(Object),
            status: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
          }),
        );
      });

      it('passing ServiceInvoice should create a new form with FormGroup', () => {
        const formGroup = service.createServiceInvoiceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            invoiceId: expect.any(Object),
            invoicePrice: expect.any(Object),
            myServiceId: expect.any(Object),
            myServiceFeeId: expect.any(Object),
            quantity: expect.any(Object),
            status: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getServiceInvoice', () => {
      it('should return NewServiceInvoice for default ServiceInvoice initial value', () => {
        const formGroup = service.createServiceInvoiceFormGroup(sampleWithNewData);

        const serviceInvoice = service.getServiceInvoice(formGroup) as any;

        expect(serviceInvoice).toMatchObject(sampleWithNewData);
      });

      it('should return NewServiceInvoice for empty ServiceInvoice initial value', () => {
        const formGroup = service.createServiceInvoiceFormGroup();

        const serviceInvoice = service.getServiceInvoice(formGroup) as any;

        expect(serviceInvoice).toMatchObject({});
      });

      it('should return ServiceInvoice', () => {
        const formGroup = service.createServiceInvoiceFormGroup(sampleWithRequiredData);

        const serviceInvoice = service.getServiceInvoice(formGroup) as any;

        expect(serviceInvoice).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ServiceInvoice should not enable id FormControl', () => {
        const formGroup = service.createServiceInvoiceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewServiceInvoice should disable id FormControl', () => {
        const formGroup = service.createServiceInvoiceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
