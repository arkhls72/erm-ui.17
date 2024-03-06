import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../address.test-samples';

import { AddressFormService } from './address-form.service';

describe('Address Form Service', () => {
  let service: AddressFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddressFormService);
  });

  describe('Service methods', () => {
    describe('createAddressFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAddressFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            streetNumber: expect.any(Object),
            streetName: expect.any(Object),
            unitNumber: expect.any(Object),
            postalCode: expect.any(Object),
            city: expect.any(Object),
            province: expect.any(Object),
            countries: expect.any(Object),
            poBox: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
          }),
        );
      });

      it('passing Address should create a new form with FormGroup', () => {
        const formGroup = service.createAddressFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            streetNumber: expect.any(Object),
            streetName: expect.any(Object),
            unitNumber: expect.any(Object),
            postalCode: expect.any(Object),
            city: expect.any(Object),
            province: expect.any(Object),
            countries: expect.any(Object),
            poBox: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getAddress', () => {
      it('should return NewAddress for default Address initial value', () => {
        const formGroup = service.createAddressFormGroup(sampleWithNewData);

        const address = service.getAddress(formGroup) as any;

        expect(address).toMatchObject(sampleWithNewData);
      });

      it('should return NewAddress for empty Address initial value', () => {
        const formGroup = service.createAddressFormGroup();

        const address = service.getAddress(formGroup) as any;

        expect(address).toMatchObject({});
      });

      it('should return Address', () => {
        const formGroup = service.createAddressFormGroup(sampleWithRequiredData);

        const address = service.getAddress(formGroup) as any;

        expect(address).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Address should not enable id FormControl', () => {
        const formGroup = service.createAddressFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAddress should disable id FormControl', () => {
        const formGroup = service.createAddressFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
