import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../exer-group-detaill.test-samples';

import { ExerGroupDetaillFormService } from './exer-group-detaill-form.service';

describe('ExerGroupDetaill Form Service', () => {
  let service: ExerGroupDetaillFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerGroupDetaillFormService);
  });

  describe('Service methods', () => {
    describe('createExerGroupDetaillFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createExerGroupDetaillFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            exerGroupId: expect.any(Object),
            exerciseId: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
          }),
        );
      });

      it('passing ExerGroupDetaill should create a new form with FormGroup', () => {
        const formGroup = service.createExerGroupDetaillFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            exerGroupId: expect.any(Object),
            exerciseId: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getExerGroupDetaill', () => {
      it('should return NewExerGroupDetaill for default ExerGroupDetaill initial value', () => {
        const formGroup = service.createExerGroupDetaillFormGroup(sampleWithNewData);

        const exerGroupDetaill = service.getExerGroupDetaill(formGroup) as any;

        expect(exerGroupDetaill).toMatchObject(sampleWithNewData);
      });

      it('should return NewExerGroupDetaill for empty ExerGroupDetaill initial value', () => {
        const formGroup = service.createExerGroupDetaillFormGroup();

        const exerGroupDetaill = service.getExerGroupDetaill(formGroup) as any;

        expect(exerGroupDetaill).toMatchObject({});
      });

      it('should return ExerGroupDetaill', () => {
        const formGroup = service.createExerGroupDetaillFormGroup(sampleWithRequiredData);

        const exerGroupDetaill = service.getExerGroupDetaill(formGroup) as any;

        expect(exerGroupDetaill).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ExerGroupDetaill should not enable id FormControl', () => {
        const formGroup = service.createExerGroupDetaillFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewExerGroupDetaill should disable id FormControl', () => {
        const formGroup = service.createExerGroupDetaillFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
