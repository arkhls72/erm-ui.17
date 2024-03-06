import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../exercise-type.test-samples';

import { ExerciseTypeFormService } from './exercise-type-form.service';

describe('ExerciseType Form Service', () => {
  let service: ExerciseTypeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseTypeFormService);
  });

  describe('Service methods', () => {
    describe('createExerciseTypeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createExerciseTypeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing ExerciseType should create a new form with FormGroup', () => {
        const formGroup = service.createExerciseTypeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getExerciseType', () => {
      it('should return NewExerciseType for default ExerciseType initial value', () => {
        const formGroup = service.createExerciseTypeFormGroup(sampleWithNewData);

        const exerciseType = service.getExerciseType(formGroup) as any;

        expect(exerciseType).toMatchObject(sampleWithNewData);
      });

      it('should return NewExerciseType for empty ExerciseType initial value', () => {
        const formGroup = service.createExerciseTypeFormGroup();

        const exerciseType = service.getExerciseType(formGroup) as any;

        expect(exerciseType).toMatchObject({});
      });

      it('should return ExerciseType', () => {
        const formGroup = service.createExerciseTypeFormGroup(sampleWithRequiredData);

        const exerciseType = service.getExerciseType(formGroup) as any;

        expect(exerciseType).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ExerciseType should not enable id FormControl', () => {
        const formGroup = service.createExerciseTypeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewExerciseType should disable id FormControl', () => {
        const formGroup = service.createExerciseTypeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
