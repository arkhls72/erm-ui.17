import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../instruction.test-samples';

import { InstructionFormService } from './instruction-form.service';

describe('Instruction Form Service', () => {
  let service: InstructionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstructionFormService);
  });

  describe('Service methods', () => {
    describe('createInstructionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInstructionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            repeat: expect.any(Object),
            hold: expect.any(Object),
            complete: expect.any(Object),
            perform: expect.any(Object),
            note: expect.any(Object),
            durationNumber: expect.any(Object),
            name: expect.any(Object),
            exerciseId: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
          }),
        );
      });

      it('passing Instruction should create a new form with FormGroup', () => {
        const formGroup = service.createInstructionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            repeat: expect.any(Object),
            hold: expect.any(Object),
            complete: expect.any(Object),
            perform: expect.any(Object),
            note: expect.any(Object),
            durationNumber: expect.any(Object),
            name: expect.any(Object),
            exerciseId: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getInstruction', () => {
      it('should return NewInstruction for default Instruction initial value', () => {
        const formGroup = service.createInstructionFormGroup(sampleWithNewData);

        const instruction = service.getInstruction(formGroup) as any;

        expect(instruction).toMatchObject(sampleWithNewData);
      });

      it('should return NewInstruction for empty Instruction initial value', () => {
        const formGroup = service.createInstructionFormGroup();

        const instruction = service.getInstruction(formGroup) as any;

        expect(instruction).toMatchObject({});
      });

      it('should return Instruction', () => {
        const formGroup = service.createInstructionFormGroup(sampleWithRequiredData);

        const instruction = service.getInstruction(formGroup) as any;

        expect(instruction).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Instruction should not enable id FormControl', () => {
        const formGroup = service.createInstructionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInstruction should disable id FormControl', () => {
        const formGroup = service.createInstructionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
