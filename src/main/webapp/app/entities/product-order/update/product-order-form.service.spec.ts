import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../product-order.test-samples';

import { ProductOrderFormService } from './product-order-form.service';

describe('ProductOrder Form Service', () => {
  let service: ProductOrderFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductOrderFormService);
  });

  describe('Service methods', () => {
    describe('createProductOrderFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProductOrderFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            myProductId: expect.any(Object),
            orderId: expect.any(Object),
            orderPrice: expect.any(Object),
            quantity: expect.any(Object),
            status: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing ProductOrder should create a new form with FormGroup', () => {
        const formGroup = service.createProductOrderFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            myProductId: expect.any(Object),
            orderId: expect.any(Object),
            orderPrice: expect.any(Object),
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

    describe('getProductOrder', () => {
      it('should return NewProductOrder for default ProductOrder initial value', () => {
        const formGroup = service.createProductOrderFormGroup(sampleWithNewData);

        const productOrder = service.getProductOrder(formGroup) as any;

        expect(productOrder).toMatchObject(sampleWithNewData);
      });

      it('should return NewProductOrder for empty ProductOrder initial value', () => {
        const formGroup = service.createProductOrderFormGroup();

        const productOrder = service.getProductOrder(formGroup) as any;

        expect(productOrder).toMatchObject({});
      });

      it('should return ProductOrder', () => {
        const formGroup = service.createProductOrderFormGroup(sampleWithRequiredData);

        const productOrder = service.getProductOrder(formGroup) as any;

        expect(productOrder).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ProductOrder should not enable id FormControl', () => {
        const formGroup = service.createProductOrderFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProductOrder should disable id FormControl', () => {
        const formGroup = service.createProductOrderFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
