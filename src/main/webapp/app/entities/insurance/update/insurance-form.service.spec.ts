import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../insurance.test-samples';

import { InsuranceFormService } from './insurance-form.service';

describe('Insurance Form Service', () => {
  let service: InsuranceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsuranceFormService);
  });

  describe('Service methods', () => {
    describe('createInsuranceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInsuranceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            clientId: expect.any(Object),
            ehcId: expect.any(Object),
            coveragerId: expect.any(Object),
            mvaId: expect.any(Object),
            wsibId: expect.any(Object),
          }),
        );
      });

      it('passing Insurance should create a new form with FormGroup', () => {
        const formGroup = service.createInsuranceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            clientId: expect.any(Object),
            ehcId: expect.any(Object),
            coveragerId: expect.any(Object),
            mvaId: expect.any(Object),
            wsibId: expect.any(Object),
          }),
        );
      });
    });

    describe('getInsurance', () => {
      it('should return NewInsurance for default Insurance initial value', () => {
        const formGroup = service.createInsuranceFormGroup(sampleWithNewData);

        const insurance = service.getInsurance(formGroup) as any;

        expect(insurance).toMatchObject(sampleWithNewData);
      });

      it('should return NewInsurance for empty Insurance initial value', () => {
        const formGroup = service.createInsuranceFormGroup();

        const insurance = service.getInsurance(formGroup) as any;

        expect(insurance).toMatchObject({});
      });

      it('should return Insurance', () => {
        const formGroup = service.createInsuranceFormGroup(sampleWithRequiredData);

        const insurance = service.getInsurance(formGroup) as any;

        expect(insurance).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Insurance should not enable id FormControl', () => {
        const formGroup = service.createInsuranceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInsurance should disable id FormControl', () => {
        const formGroup = service.createInsuranceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
