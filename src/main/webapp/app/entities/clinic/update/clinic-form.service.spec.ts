import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../clinic.test-samples';

import { ClinicFormService } from './clinic-form.service';

describe('Clinic Form Service', () => {
  let service: ClinicFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicFormService);
  });

  describe('Service methods', () => {
    describe('createClinicFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createClinicFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            phone: expect.any(Object),
            fax: expect.any(Object),
            email: expect.any(Object),
            addressId: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing Clinic should create a new form with FormGroup', () => {
        const formGroup = service.createClinicFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            phone: expect.any(Object),
            fax: expect.any(Object),
            email: expect.any(Object),
            addressId: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getClinic', () => {
      it('should return NewClinic for default Clinic initial value', () => {
        const formGroup = service.createClinicFormGroup(sampleWithNewData);

        const clinic = service.getClinic(formGroup) as any;

        expect(clinic).toMatchObject(sampleWithNewData);
      });

      it('should return NewClinic for empty Clinic initial value', () => {
        const formGroup = service.createClinicFormGroup();

        const clinic = service.getClinic(formGroup) as any;

        expect(clinic).toMatchObject({});
      });

      it('should return Clinic', () => {
        const formGroup = service.createClinicFormGroup(sampleWithRequiredData);

        const clinic = service.getClinic(formGroup) as any;

        expect(clinic).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Clinic should not enable id FormControl', () => {
        const formGroup = service.createClinicFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClinic should disable id FormControl', () => {
        const formGroup = service.createClinicFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
