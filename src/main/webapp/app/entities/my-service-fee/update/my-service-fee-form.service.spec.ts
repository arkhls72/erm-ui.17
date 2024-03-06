import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../my-service-fee.test-samples';

import { MyServiceFeeFormService } from './my-service-fee-form.service';

describe('MyServiceFee Form Service', () => {
  let service: MyServiceFeeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyServiceFeeFormService);
  });

  describe('Service methods', () => {
    describe('createMyServiceFeeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMyServiceFeeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fee: expect.any(Object),
            feeTypeId: expect.any(Object),
            myServiceId: expect.any(Object),
            note: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing MyServiceFee should create a new form with FormGroup', () => {
        const formGroup = service.createMyServiceFeeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fee: expect.any(Object),
            feeTypeId: expect.any(Object),
            myServiceId: expect.any(Object),
            note: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getMyServiceFee', () => {
      it('should return NewMyServiceFee for default MyServiceFee initial value', () => {
        const formGroup = service.createMyServiceFeeFormGroup(sampleWithNewData);

        const myServiceFee = service.getMyServiceFee(formGroup) as any;

        expect(myServiceFee).toMatchObject(sampleWithNewData);
      });

      it('should return NewMyServiceFee for empty MyServiceFee initial value', () => {
        const formGroup = service.createMyServiceFeeFormGroup();

        const myServiceFee = service.getMyServiceFee(formGroup) as any;

        expect(myServiceFee).toMatchObject({});
      });

      it('should return MyServiceFee', () => {
        const formGroup = service.createMyServiceFeeFormGroup(sampleWithRequiredData);

        const myServiceFee = service.getMyServiceFee(formGroup) as any;

        expect(myServiceFee).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing MyServiceFee should not enable id FormControl', () => {
        const formGroup = service.createMyServiceFeeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMyServiceFee should disable id FormControl', () => {
        const formGroup = service.createMyServiceFeeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
