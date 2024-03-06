import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../medical.test-samples';

import { MedicalFormService } from './medical-form.service';

describe('Medical Form Service', () => {
  let service: MedicalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalFormService);
  });

  describe('Service methods', () => {
    describe('createMedicalFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMedicalFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            clientId: expect.any(Object),
            injuryId: expect.any(Object),
            medicationId: expect.any(Object),
            conditionId: expect.any(Object),
            operationId: expect.any(Object),
          }),
        );
      });

      it('passing Medical should create a new form with FormGroup', () => {
        const formGroup = service.createMedicalFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            clientId: expect.any(Object),
            injuryId: expect.any(Object),
            medicationId: expect.any(Object),
            conditionId: expect.any(Object),
            operationId: expect.any(Object),
          }),
        );
      });
    });

    describe('getMedical', () => {
      it('should return NewMedical for default Medical initial value', () => {
        const formGroup = service.createMedicalFormGroup(sampleWithNewData);

        const medical = service.getMedical(formGroup) as any;

        expect(medical).toMatchObject(sampleWithNewData);
      });

      it('should return NewMedical for empty Medical initial value', () => {
        const formGroup = service.createMedicalFormGroup();

        const medical = service.getMedical(formGroup) as any;

        expect(medical).toMatchObject({});
      });

      it('should return Medical', () => {
        const formGroup = service.createMedicalFormGroup(sampleWithRequiredData);

        const medical = service.getMedical(formGroup) as any;

        expect(medical).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Medical should not enable id FormControl', () => {
        const formGroup = service.createMedicalFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMedical should disable id FormControl', () => {
        const formGroup = service.createMedicalFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
