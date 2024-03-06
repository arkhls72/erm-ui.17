import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../countries.test-samples';

import { CountriesFormService } from './countries-form.service';

describe('Countries Form Service', () => {
  let service: CountriesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountriesFormService);
  });

  describe('Service methods', () => {
    describe('createCountriesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCountriesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing Countries should create a new form with FormGroup', () => {
        const formGroup = service.createCountriesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getCountries', () => {
      it('should return NewCountries for default Countries initial value', () => {
        const formGroup = service.createCountriesFormGroup(sampleWithNewData);

        const countries = service.getCountries(formGroup) as any;

        expect(countries).toMatchObject(sampleWithNewData);
      });

      it('should return NewCountries for empty Countries initial value', () => {
        const formGroup = service.createCountriesFormGroup();

        const countries = service.getCountries(formGroup) as any;

        expect(countries).toMatchObject({});
      });

      it('should return Countries', () => {
        const formGroup = service.createCountriesFormGroup(sampleWithRequiredData);

        const countries = service.getCountries(formGroup) as any;

        expect(countries).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Countries should not enable id FormControl', () => {
        const formGroup = service.createCountriesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCountries should disable id FormControl', () => {
        const formGroup = service.createCountriesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
