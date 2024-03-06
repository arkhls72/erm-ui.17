import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../therapy.test-samples';

import { TherapyFormService } from './therapy-form.service';

describe('Therapy Form Service', () => {
  let service: TherapyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TherapyFormService);
  });

  describe('Service methods', () => {
    describe('createTherapyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTherapyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing Therapy should create a new form with FormGroup', () => {
        const formGroup = service.createTherapyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getTherapy', () => {
      it('should return NewTherapy for default Therapy initial value', () => {
        const formGroup = service.createTherapyFormGroup(sampleWithNewData);

        const therapy = service.getTherapy(formGroup) as any;

        expect(therapy).toMatchObject(sampleWithNewData);
      });

      it('should return NewTherapy for empty Therapy initial value', () => {
        const formGroup = service.createTherapyFormGroup();

        const therapy = service.getTherapy(formGroup) as any;

        expect(therapy).toMatchObject({});
      });

      it('should return Therapy', () => {
        const formGroup = service.createTherapyFormGroup(sampleWithRequiredData);

        const therapy = service.getTherapy(formGroup) as any;

        expect(therapy).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Therapy should not enable id FormControl', () => {
        const formGroup = service.createTherapyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTherapy should disable id FormControl', () => {
        const formGroup = service.createTherapyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
