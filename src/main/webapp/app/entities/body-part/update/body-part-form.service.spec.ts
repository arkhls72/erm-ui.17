import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../body-part.test-samples';

import { BodyPartFormService } from './body-part-form.service';

describe('BodyPart Form Service', () => {
  let service: BodyPartFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BodyPartFormService);
  });

  describe('Service methods', () => {
    describe('createBodyPartFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBodyPartFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing BodyPart should create a new form with FormGroup', () => {
        const formGroup = service.createBodyPartFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getBodyPart', () => {
      it('should return NewBodyPart for default BodyPart initial value', () => {
        const formGroup = service.createBodyPartFormGroup(sampleWithNewData);

        const bodyPart = service.getBodyPart(formGroup) as any;

        expect(bodyPart).toMatchObject(sampleWithNewData);
      });

      it('should return NewBodyPart for empty BodyPart initial value', () => {
        const formGroup = service.createBodyPartFormGroup();

        const bodyPart = service.getBodyPart(formGroup) as any;

        expect(bodyPart).toMatchObject({});
      });

      it('should return BodyPart', () => {
        const formGroup = service.createBodyPartFormGroup(sampleWithRequiredData);

        const bodyPart = service.getBodyPart(formGroup) as any;

        expect(bodyPart).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing BodyPart should not enable id FormControl', () => {
        const formGroup = service.createBodyPartFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBodyPart should disable id FormControl', () => {
        const formGroup = service.createBodyPartFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
