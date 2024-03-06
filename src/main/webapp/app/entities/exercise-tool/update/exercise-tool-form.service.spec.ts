import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../exercise-tool.test-samples';

import { ExerciseToolFormService } from './exercise-tool-form.service';

describe('ExerciseTool Form Service', () => {
  let service: ExerciseToolFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseToolFormService);
  });

  describe('Service methods', () => {
    describe('createExerciseToolFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createExerciseToolFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing ExerciseTool should create a new form with FormGroup', () => {
        const formGroup = service.createExerciseToolFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getExerciseTool', () => {
      it('should return NewExerciseTool for default ExerciseTool initial value', () => {
        const formGroup = service.createExerciseToolFormGroup(sampleWithNewData);

        const exerciseTool = service.getExerciseTool(formGroup) as any;

        expect(exerciseTool).toMatchObject(sampleWithNewData);
      });

      it('should return NewExerciseTool for empty ExerciseTool initial value', () => {
        const formGroup = service.createExerciseToolFormGroup();

        const exerciseTool = service.getExerciseTool(formGroup) as any;

        expect(exerciseTool).toMatchObject({});
      });

      it('should return ExerciseTool', () => {
        const formGroup = service.createExerciseToolFormGroup(sampleWithRequiredData);

        const exerciseTool = service.getExerciseTool(formGroup) as any;

        expect(exerciseTool).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ExerciseTool should not enable id FormControl', () => {
        const formGroup = service.createExerciseToolFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewExerciseTool should disable id FormControl', () => {
        const formGroup = service.createExerciseToolFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
