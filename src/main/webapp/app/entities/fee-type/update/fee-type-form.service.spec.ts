import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../fee-type.test-samples';

import { FeeTypeFormService } from './fee-type-form.service';

describe('FeeType Form Service', () => {
  let service: FeeTypeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeeTypeFormService);
  });

  describe('Service methods', () => {
    describe('createFeeTypeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFeeTypeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing FeeType should create a new form with FormGroup', () => {
        const formGroup = service.createFeeTypeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getFeeType', () => {
      it('should return NewFeeType for default FeeType initial value', () => {
        const formGroup = service.createFeeTypeFormGroup(sampleWithNewData);

        const feeType = service.getFeeType(formGroup) as any;

        expect(feeType).toMatchObject(sampleWithNewData);
      });

      it('should return NewFeeType for empty FeeType initial value', () => {
        const formGroup = service.createFeeTypeFormGroup();

        const feeType = service.getFeeType(formGroup) as any;

        expect(feeType).toMatchObject({});
      });

      it('should return FeeType', () => {
        const formGroup = service.createFeeTypeFormGroup(sampleWithRequiredData);

        const feeType = service.getFeeType(formGroup) as any;

        expect(feeType).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing FeeType should not enable id FormControl', () => {
        const formGroup = service.createFeeTypeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFeeType should disable id FormControl', () => {
        const formGroup = service.createFeeTypeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
