import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../assessment.test-samples';

import { AssessmentFormService } from './assessment-form.service';

describe('Assessment Form Service', () => {
  let service: AssessmentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssessmentFormService);
  });

  describe('Service methods', () => {
    describe('createAssessmentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAssessmentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            painIntensity: expect.any(Object),
            sourcePain: expect.any(Object),
            painOnSet: expect.any(Object),
            aggravationPain: expect.any(Object),
            note: expect.any(Object),
            clientId: expect.any(Object),
            plans: expect.any(Object),
            isBack: expect.any(Object),
            soapNote: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing Assessment should create a new form with FormGroup', () => {
        const formGroup = service.createAssessmentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            painIntensity: expect.any(Object),
            sourcePain: expect.any(Object),
            painOnSet: expect.any(Object),
            aggravationPain: expect.any(Object),
            note: expect.any(Object),
            clientId: expect.any(Object),
            plans: expect.any(Object),
            isBack: expect.any(Object),
            soapNote: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getAssessment', () => {
      it('should return NewAssessment for default Assessment initial value', () => {
        const formGroup = service.createAssessmentFormGroup(sampleWithNewData);

        const assessment = service.getAssessment(formGroup) as any;

        expect(assessment).toMatchObject(sampleWithNewData);
      });

      it('should return NewAssessment for empty Assessment initial value', () => {
        const formGroup = service.createAssessmentFormGroup();

        const assessment = service.getAssessment(formGroup) as any;

        expect(assessment).toMatchObject({});
      });

      it('should return Assessment', () => {
        const formGroup = service.createAssessmentFormGroup(sampleWithRequiredData);

        const assessment = service.getAssessment(formGroup) as any;

        expect(assessment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Assessment should not enable id FormControl', () => {
        const formGroup = service.createAssessmentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAssessment should disable id FormControl', () => {
        const formGroup = service.createAssessmentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
