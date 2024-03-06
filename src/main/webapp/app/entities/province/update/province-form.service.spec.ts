import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../province.test-samples';

import { ProvinceFormService } from './province-form.service';

describe('Province Form Service', () => {
  let service: ProvinceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvinceFormService);
  });

  describe('Service methods', () => {
    describe('createProvinceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProvinceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing Province should create a new form with FormGroup', () => {
        const formGroup = service.createProvinceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getProvince', () => {
      it('should return NewProvince for default Province initial value', () => {
        const formGroup = service.createProvinceFormGroup(sampleWithNewData);

        const province = service.getProvince(formGroup) as any;

        expect(province).toMatchObject(sampleWithNewData);
      });

      it('should return NewProvince for empty Province initial value', () => {
        const formGroup = service.createProvinceFormGroup();

        const province = service.getProvince(formGroup) as any;

        expect(province).toMatchObject({});
      });

      it('should return Province', () => {
        const formGroup = service.createProvinceFormGroup(sampleWithRequiredData);

        const province = service.getProvince(formGroup) as any;

        expect(province).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Province should not enable id FormControl', () => {
        const formGroup = service.createProvinceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProvince should disable id FormControl', () => {
        const formGroup = service.createProvinceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
