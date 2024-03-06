import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../product-invoice.test-samples';

import { ProductInvoiceFormService } from './product-invoice-form.service';

describe('ProductInvoice Form Service', () => {
  let service: ProductInvoiceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductInvoiceFormService);
  });

  describe('Service methods', () => {
    describe('createProductInvoiceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProductInvoiceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            invoiceId: expect.any(Object),
            myProductId: expect.any(Object),
            myProductFeeId: expect.any(Object),
            invoicePrice: expect.any(Object),
            quantity: expect.any(Object),
            status: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing ProductInvoice should create a new form with FormGroup', () => {
        const formGroup = service.createProductInvoiceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            invoiceId: expect.any(Object),
            myProductId: expect.any(Object),
            myProductFeeId: expect.any(Object),
            invoicePrice: expect.any(Object),
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

    describe('getProductInvoice', () => {
      it('should return NewProductInvoice for default ProductInvoice initial value', () => {
        const formGroup = service.createProductInvoiceFormGroup(sampleWithNewData);

        const productInvoice = service.getProductInvoice(formGroup) as any;

        expect(productInvoice).toMatchObject(sampleWithNewData);
      });

      it('should return NewProductInvoice for empty ProductInvoice initial value', () => {
        const formGroup = service.createProductInvoiceFormGroup();

        const productInvoice = service.getProductInvoice(formGroup) as any;

        expect(productInvoice).toMatchObject({});
      });

      it('should return ProductInvoice', () => {
        const formGroup = service.createProductInvoiceFormGroup(sampleWithRequiredData);

        const productInvoice = service.getProductInvoice(formGroup) as any;

        expect(productInvoice).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ProductInvoice should not enable id FormControl', () => {
        const formGroup = service.createProductInvoiceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProductInvoice should disable id FormControl', () => {
        const formGroup = service.createProductInvoiceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
