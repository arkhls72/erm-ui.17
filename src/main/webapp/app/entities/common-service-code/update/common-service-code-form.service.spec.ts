import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../common-service-code.test-samples';

import { CommonServiceCodeFormService } from './common-service-code-form.service';

describe('CommonServiceCode Form Service', () => {
  let service: CommonServiceCodeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonServiceCodeFormService);
  });

  describe('Service methods', () => {
    describe('createCommonServiceCodeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCommonServiceCodeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            serviceCode: expect.any(Object),
            description: expect.any(Object),
            serviceType: expect.any(Object),
            category: expect.any(Object),
            note: expect.any(Object),
          }),
        );
      });

      it('passing CommonServiceCode should create a new form with FormGroup', () => {
        const formGroup = service.createCommonServiceCodeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            serviceCode: expect.any(Object),
            description: expect.any(Object),
            serviceType: expect.any(Object),
            category: expect.any(Object),
            note: expect.any(Object),
          }),
        );
      });
    });

    describe('getCommonServiceCode', () => {
      it('should return NewCommonServiceCode for default CommonServiceCode initial value', () => {
        const formGroup = service.createCommonServiceCodeFormGroup(sampleWithNewData);

        const commonServiceCode = service.getCommonServiceCode(formGroup) as any;

        expect(commonServiceCode).toMatchObject(sampleWithNewData);
      });

      it('should return NewCommonServiceCode for empty CommonServiceCode initial value', () => {
        const formGroup = service.createCommonServiceCodeFormGroup();

        const commonServiceCode = service.getCommonServiceCode(formGroup) as any;

        expect(commonServiceCode).toMatchObject({});
      });

      it('should return CommonServiceCode', () => {
        const formGroup = service.createCommonServiceCodeFormGroup(sampleWithRequiredData);

        const commonServiceCode = service.getCommonServiceCode(formGroup) as any;

        expect(commonServiceCode).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing CommonServiceCode should not enable id FormControl', () => {
        const formGroup = service.createCommonServiceCodeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCommonServiceCode should disable id FormControl', () => {
        const formGroup = service.createCommonServiceCodeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
