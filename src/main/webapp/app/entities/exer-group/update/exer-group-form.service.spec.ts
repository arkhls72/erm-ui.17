import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../exer-group.test-samples';

import { ExerGroupFormService } from './exer-group-form.service';

describe('ExerGroup Form Service', () => {
  let service: ExerGroupFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerGroupFormService);
  });

  describe('Service methods', () => {
    describe('createExerGroupFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createExerGroupFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
          }),
        );
      });

      it('passing ExerGroup should create a new form with FormGroup', () => {
        const formGroup = service.createExerGroupFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getExerGroup', () => {
      it('should return NewExerGroup for default ExerGroup initial value', () => {
        const formGroup = service.createExerGroupFormGroup(sampleWithNewData);

        const exerGroup = service.getExerGroup(formGroup) as any;

        expect(exerGroup).toMatchObject(sampleWithNewData);
      });

      it('should return NewExerGroup for empty ExerGroup initial value', () => {
        const formGroup = service.createExerGroupFormGroup();

        const exerGroup = service.getExerGroup(formGroup) as any;

        expect(exerGroup).toMatchObject({});
      });

      it('should return ExerGroup', () => {
        const formGroup = service.createExerGroupFormGroup(sampleWithRequiredData);

        const exerGroup = service.getExerGroup(formGroup) as any;

        expect(exerGroup).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ExerGroup should not enable id FormControl', () => {
        const formGroup = service.createExerGroupFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewExerGroup should disable id FormControl', () => {
        const formGroup = service.createExerGroupFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
