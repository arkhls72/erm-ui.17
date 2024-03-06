import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../muscle.test-samples';

import { MuscleFormService } from './muscle-form.service';

describe('Muscle Form Service', () => {
  let service: MuscleFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MuscleFormService);
  });

  describe('Service methods', () => {
    describe('createMuscleFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMuscleFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing Muscle should create a new form with FormGroup', () => {
        const formGroup = service.createMuscleFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getMuscle', () => {
      it('should return NewMuscle for default Muscle initial value', () => {
        const formGroup = service.createMuscleFormGroup(sampleWithNewData);

        const muscle = service.getMuscle(formGroup) as any;

        expect(muscle).toMatchObject(sampleWithNewData);
      });

      it('should return NewMuscle for empty Muscle initial value', () => {
        const formGroup = service.createMuscleFormGroup();

        const muscle = service.getMuscle(formGroup) as any;

        expect(muscle).toMatchObject({});
      });

      it('should return Muscle', () => {
        const formGroup = service.createMuscleFormGroup(sampleWithRequiredData);

        const muscle = service.getMuscle(formGroup) as any;

        expect(muscle).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Muscle should not enable id FormControl', () => {
        const formGroup = service.createMuscleFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMuscle should disable id FormControl', () => {
        const formGroup = service.createMuscleFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
