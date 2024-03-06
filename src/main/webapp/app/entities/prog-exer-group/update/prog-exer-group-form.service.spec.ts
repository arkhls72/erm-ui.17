import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../prog-exer-group.test-samples';

import { ProgExerGroupFormService } from './prog-exer-group-form.service';

describe('ProgExerGroup Form Service', () => {
  let service: ProgExerGroupFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgExerGroupFormService);
  });

  describe('Service methods', () => {
    describe('createProgExerGroupFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProgExerGroupFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            exerGroupId: expect.any(Object),
            progId: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing ProgExerGroup should create a new form with FormGroup', () => {
        const formGroup = service.createProgExerGroupFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            exerGroupId: expect.any(Object),
            progId: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getProgExerGroup', () => {
      it('should return NewProgExerGroup for default ProgExerGroup initial value', () => {
        const formGroup = service.createProgExerGroupFormGroup(sampleWithNewData);

        const progExerGroup = service.getProgExerGroup(formGroup) as any;

        expect(progExerGroup).toMatchObject(sampleWithNewData);
      });

      it('should return NewProgExerGroup for empty ProgExerGroup initial value', () => {
        const formGroup = service.createProgExerGroupFormGroup();

        const progExerGroup = service.getProgExerGroup(formGroup) as any;

        expect(progExerGroup).toMatchObject({});
      });

      it('should return ProgExerGroup', () => {
        const formGroup = service.createProgExerGroupFormGroup(sampleWithRequiredData);

        const progExerGroup = service.getProgExerGroup(formGroup) as any;

        expect(progExerGroup).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ProgExerGroup should not enable id FormControl', () => {
        const formGroup = service.createProgExerGroupFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProgExerGroup should disable id FormControl', () => {
        const formGroup = service.createProgExerGroupFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
