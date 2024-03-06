import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../coverage.test-samples';

import { CoverageFormService } from './coverage-form.service';

describe('Coverage Form Service', () => {
  let service: CoverageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoverageFormService);
  });

  describe('Service methods', () => {
    describe('createCoverageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCoverageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            therapyId: expect.any(Object),
            ehcId: expect.any(Object),
            wsibId: expect.any(Object),
            mvaId: expect.any(Object),
            limit: expect.any(Object),
            note: expect.any(Object),
            lastModifiedName: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
          }),
        );
      });

      it('passing Coverage should create a new form with FormGroup', () => {
        const formGroup = service.createCoverageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            therapyId: expect.any(Object),
            ehcId: expect.any(Object),
            wsibId: expect.any(Object),
            mvaId: expect.any(Object),
            limit: expect.any(Object),
            note: expect.any(Object),
            lastModifiedName: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getCoverage', () => {
      it('should return NewCoverage for default Coverage initial value', () => {
        const formGroup = service.createCoverageFormGroup(sampleWithNewData);

        const coverage = service.getCoverage(formGroup) as any;

        expect(coverage).toMatchObject(sampleWithNewData);
      });

      it('should return NewCoverage for empty Coverage initial value', () => {
        const formGroup = service.createCoverageFormGroup();

        const coverage = service.getCoverage(formGroup) as any;

        expect(coverage).toMatchObject({});
      });

      it('should return Coverage', () => {
        const formGroup = service.createCoverageFormGroup(sampleWithRequiredData);

        const coverage = service.getCoverage(formGroup) as any;

        expect(coverage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Coverage should not enable id FormControl', () => {
        const formGroup = service.createCoverageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCoverage should disable id FormControl', () => {
        const formGroup = service.createCoverageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
