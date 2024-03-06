import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../position.test-samples';

import { PositionFormService } from './position-form.service';

describe('Position Form Service', () => {
  let service: PositionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PositionFormService);
  });

  describe('Service methods', () => {
    describe('createPositionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPositionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing Position should create a new form with FormGroup', () => {
        const formGroup = service.createPositionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getPosition', () => {
      it('should return NewPosition for default Position initial value', () => {
        const formGroup = service.createPositionFormGroup(sampleWithNewData);

        const position = service.getPosition(formGroup) as any;

        expect(position).toMatchObject(sampleWithNewData);
      });

      it('should return NewPosition for empty Position initial value', () => {
        const formGroup = service.createPositionFormGroup();

        const position = service.getPosition(formGroup) as any;

        expect(position).toMatchObject({});
      });

      it('should return IPosition', () => {
        const formGroup = service.createPositionFormGroup(sampleWithRequiredData);

        const position = service.getPosition(formGroup) as any;

        expect(position).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Position should not enable id FormControl', () => {
        const formGroup = service.createPositionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPosition should disable id FormControl', () => {
        const formGroup = service.createPositionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
