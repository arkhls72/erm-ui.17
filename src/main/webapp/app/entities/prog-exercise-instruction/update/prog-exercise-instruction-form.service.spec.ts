import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../prog-exercise-instruction.test-samples';

import { ProgExerciseInstructionFormService } from './prog-exercise-instruction-form.service';

describe('ProgExerciseInstruction Form Service', () => {
  let service: ProgExerciseInstructionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgExerciseInstructionFormService);
  });

  describe('Service methods', () => {
    describe('createProgExerciseInstructionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProgExerciseInstructionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            exerciseId: expect.any(Object),
            progId: expect.any(Object),
            instruction: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing ProgExerciseInstruction should create a new form with FormGroup', () => {
        const formGroup = service.createProgExerciseInstructionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            exerciseId: expect.any(Object),
            progId: expect.any(Object),
            instruction: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getProgExerciseInstruction', () => {
      it('should return NewProgExerciseInstruction for default ProgExerciseInstruction initial value', () => {
        const formGroup = service.createProgExerciseInstructionFormGroup(sampleWithNewData);

        const progExerciseInstruction = service.getProgExerciseInstruction(formGroup) as any;

        expect(progExerciseInstruction).toMatchObject(sampleWithNewData);
      });

      it('should return NewProgExerciseInstruction for empty ProgExerciseInstruction initial value', () => {
        const formGroup = service.createProgExerciseInstructionFormGroup();

        const progExerciseInstruction = service.getProgExerciseInstruction(formGroup) as any;

        expect(progExerciseInstruction).toMatchObject({});
      });

      it('should return ProgExerciseInstruction', () => {
        const formGroup = service.createProgExerciseInstructionFormGroup(sampleWithRequiredData);

        const progExerciseInstruction = service.getProgExerciseInstruction(formGroup) as any;

        expect(progExerciseInstruction).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ProgExerciseInstruction should not enable id FormControl', () => {
        const formGroup = service.createProgExerciseInstructionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProgExerciseInstruction should disable id FormControl', () => {
        const formGroup = service.createProgExerciseInstructionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
