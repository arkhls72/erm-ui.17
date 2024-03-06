import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../prog-group-instruction.test-samples';

import { ProgGroupInstructionFormService } from './prog-group-instruction-form.service';

describe('ProgGroupInstruction Form Service', () => {
  let service: ProgGroupInstructionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgGroupInstructionFormService);
  });

  describe('Service methods', () => {
    describe('createProgGroupInstructionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProgGroupInstructionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            exerciseId: expect.any(Object),
            progId: expect.any(Object),
            groupId: expect.any(Object),
            instructionId: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing ProgGroupInstruction should create a new form with FormGroup', () => {
        const formGroup = service.createProgGroupInstructionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            exerciseId: expect.any(Object),
            progId: expect.any(Object),
            groupId: expect.any(Object),
            instructionId: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getProgGroupInstruction', () => {
      it('should return NewProgGroupInstruction for default ProgGroupInstruction initial value', () => {
        const formGroup = service.createProgGroupInstructionFormGroup(sampleWithNewData);

        const progGroupInstruction = service.getProgGroupInstruction(formGroup) as any;

        expect(progGroupInstruction).toMatchObject(sampleWithNewData);
      });

      it('should return NewProgGroupInstruction for empty ProgGroupInstruction initial value', () => {
        const formGroup = service.createProgGroupInstructionFormGroup();

        const progGroupInstruction = service.getProgGroupInstruction(formGroup) as any;

        expect(progGroupInstruction).toMatchObject({});
      });

      it('should return ProgGroupInstruction', () => {
        const formGroup = service.createProgGroupInstructionFormGroup(sampleWithRequiredData);

        const progGroupInstruction = service.getProgGroupInstruction(formGroup) as any;

        expect(progGroupInstruction).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ProgGroupInstruction should not enable id FormControl', () => {
        const formGroup = service.createProgGroupInstructionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProgGroupInstruction should disable id FormControl', () => {
        const formGroup = service.createProgGroupInstructionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
