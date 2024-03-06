import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../my-product-fee.test-samples';

import { MyProductFeeFormService } from './my-product-fee-form.service';

describe('MyProductFee Form Service', () => {
  let service: MyProductFeeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyProductFeeFormService);
  });

  describe('Service methods', () => {
    describe('createMyProductFeeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMyProductFeeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fee: expect.any(Object),
            feeTypeId: expect.any(Object),
            feeTypeName: expect.any(Object),
            myProductId: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing MyProductFee should create a new form with FormGroup', () => {
        const formGroup = service.createMyProductFeeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fee: expect.any(Object),
            feeTypeId: expect.any(Object),
            feeTypeName: expect.any(Object),
            myProductId: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getMyProductFee', () => {
      it('should return NewMyProductFee for default MyProductFee initial value', () => {
        const formGroup = service.createMyProductFeeFormGroup(sampleWithNewData);

        const myProductFee = service.getMyProductFee(formGroup) as any;

        expect(myProductFee).toMatchObject(sampleWithNewData);
      });

      it('should return NewMyProductFee for empty MyProductFee initial value', () => {
        const formGroup = service.createMyProductFeeFormGroup();

        const myProductFee = service.getMyProductFee(formGroup) as any;

        expect(myProductFee).toMatchObject({});
      });

      it('should return MyProductFee', () => {
        const formGroup = service.createMyProductFeeFormGroup(sampleWithRequiredData);

        const myProductFee = service.getMyProductFee(formGroup) as any;

        expect(myProductFee).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing MyProductFee should not enable id FormControl', () => {
        const formGroup = service.createMyProductFeeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMyProductFee should disable id FormControl', () => {
        const formGroup = service.createMyProductFeeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
