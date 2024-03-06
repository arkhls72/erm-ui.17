import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../exercise-level.test-samples';

import { ExerciseLevelFormService } from './exercise-level-form.service';

describe('ExerciseLevel Form Service', () => {
  let service: ExerciseLevelFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseLevelFormService);
  });

  describe('Service methods', () => {
    describe('createExerciseLevelFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createExerciseLevelFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing ExerciseLevel should create a new form with FormGroup', () => {
        const formGroup = service.createExerciseLevelFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getExerciseLevel', () => {
      it('should return NewExerciseLevel for default ExerciseLevel initial value', () => {
        const formGroup = service.createExerciseLevelFormGroup(sampleWithNewData);

        const exerciseLevel = service.getExerciseLevel(formGroup) as any;

        expect(exerciseLevel).toMatchObject(sampleWithNewData);
      });

      it('should return NewExerciseLevel for empty ExerciseLevel initial value', () => {
        const formGroup = service.createExerciseLevelFormGroup();

        const exerciseLevel = service.getExerciseLevel(formGroup) as any;

        expect(exerciseLevel).toMatchObject({});
      });

      it('should return ExerciseLevel', () => {
        const formGroup = service.createExerciseLevelFormGroup(sampleWithRequiredData);

        const exerciseLevel = service.getExerciseLevel(formGroup) as any;

        expect(exerciseLevel).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ExerciseLevel should not enable id FormControl', () => {
        const formGroup = service.createExerciseLevelFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewExerciseLevel should disable id FormControl', () => {
        const formGroup = service.createExerciseLevelFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
