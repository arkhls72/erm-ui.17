import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../service-type.test-samples';

import { ServiceTypeFormService } from './service-type-form.service';

describe('ServiceType Form Service', () => {
  let service: ServiceTypeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceTypeFormService);
  });

  describe('Service methods', () => {
    describe('createServiceTypeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createServiceTypeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing ServiceType should create a new form with FormGroup', () => {
        const formGroup = service.createServiceTypeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getServiceType', () => {
      it('should return NewServiceType for default ServiceType initial value', () => {
        const formGroup = service.createServiceTypeFormGroup(sampleWithNewData);

        const serviceType = service.getServiceType(formGroup) as any;

        expect(serviceType).toMatchObject(sampleWithNewData);
      });

      it('should return NewServiceType for empty ServiceType initial value', () => {
        const formGroup = service.createServiceTypeFormGroup();

        const serviceType = service.getServiceType(formGroup) as any;

        expect(serviceType).toMatchObject({});
      });

      it('should return ServiceType', () => {
        const formGroup = service.createServiceTypeFormGroup(sampleWithRequiredData);

        const serviceType = service.getServiceType(formGroup) as any;

        expect(serviceType).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ServiceType should not enable id FormControl', () => {
        const formGroup = service.createServiceTypeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewServiceType should disable id FormControl', () => {
        const formGroup = service.createServiceTypeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
