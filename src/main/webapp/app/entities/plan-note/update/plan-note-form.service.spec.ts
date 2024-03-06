import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../plan-note.test-samples';

import { PlanNoteFormService } from './plan-note-form.service';

describe('PlanNote Form Service', () => {
  let service: PlanNoteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanNoteFormService);
  });

  describe('Service methods', () => {
    describe('createPlanNoteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPlanNoteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            planId: expect.any(Object),
            note: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModfiedDate: expect.any(Object),
          }),
        );
      });

      it('passing PlanNote should create a new form with FormGroup', () => {
        const formGroup = service.createPlanNoteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            planId: expect.any(Object),
            note: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModfiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getPlanNote', () => {
      it('should return NewPlanNote for default PlanNote initial value', () => {
        const formGroup = service.createPlanNoteFormGroup(sampleWithNewData);

        const planNote = service.getPlanNote(formGroup) as any;

        expect(planNote).toMatchObject(sampleWithNewData);
      });

      it('should return NewPlanNote for empty PlanNote initial value', () => {
        const formGroup = service.createPlanNoteFormGroup();

        const planNote = service.getPlanNote(formGroup) as any;

        expect(planNote).toMatchObject({});
      });

      it('should return PlanNote', () => {
        const formGroup = service.createPlanNoteFormGroup(sampleWithRequiredData);

        const planNote = service.getPlanNote(formGroup) as any;

        expect(planNote).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing PlanNote should not enable id FormControl', () => {
        const formGroup = service.createPlanNoteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPlanNote should disable id FormControl', () => {
        const formGroup = service.createPlanNoteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
