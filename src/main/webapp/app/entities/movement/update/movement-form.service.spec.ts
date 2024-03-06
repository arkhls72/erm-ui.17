import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../movement.test-samples';

import { MovementFormService } from './movement-form.service';

describe('Movement Form Service', () => {
  let service: MovementFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovementFormService);
  });

  describe('Service methods', () => {
    describe('createMovementFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMovementFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing Movement should create a new form with FormGroup', () => {
        const formGroup = service.createMovementFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getMovement', () => {
      it('should return NewMovement for default Movement initial value', () => {
        const formGroup = service.createMovementFormGroup(sampleWithNewData);

        const movement = service.getMovement(formGroup) as any;

        expect(movement).toMatchObject(sampleWithNewData);
      });

      it('should return NewMovement for empty Movement initial value', () => {
        const formGroup = service.createMovementFormGroup();

        const movement = service.getMovement(formGroup) as any;

        expect(movement).toMatchObject({});
      });

      it('should return Movement', () => {
        const formGroup = service.createMovementFormGroup(sampleWithRequiredData);

        const movement = service.getMovement(formGroup) as any;

        expect(movement).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Movement should not enable id FormControl', () => {
        const formGroup = service.createMovementFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMovement should disable id FormControl', () => {
        const formGroup = service.createMovementFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
