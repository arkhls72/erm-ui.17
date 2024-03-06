import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mva.test-samples';

import { MvaFormService } from './mva-form.service';

describe('Mva Form Service', () => {
  let service: MvaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MvaFormService);
  });

  describe('Service methods', () => {
    describe('createMvaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMvaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            insurance: expect.any(Object),
            clientId: expect.any(Object),
            claimNumber: expect.any(Object),
            accidentDate: expect.any(Object),
            adjuster: expect.any(Object),
            status: expect.any(Object),
            closeDate: expect.any(Object),
            phoneExtension: expect.any(Object),
            cellPhone: expect.any(Object),
            fax: expect.any(Object),
            email: expect.any(Object),
            note: expect.any(Object),
            addressId: expect.any(Object),
            coverages: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            phone: expect.any(Object),
          }),
        );
      });

      it('passing Mva should create a new form with FormGroup', () => {
        const formGroup = service.createMvaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            insurance: expect.any(Object),
            clientId: expect.any(Object),
            claimNumber: expect.any(Object),
            accidentDate: expect.any(Object),
            adjuster: expect.any(Object),
            status: expect.any(Object),
            closeDate: expect.any(Object),
            phoneExtension: expect.any(Object),
            cellPhone: expect.any(Object),
            fax: expect.any(Object),
            email: expect.any(Object),
            note: expect.any(Object),
            addressId: expect.any(Object),
            coverages: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            phone: expect.any(Object),
          }),
        );
      });
    });

    describe('getMva', () => {
      it('should return NewMva for default Mva initial value', () => {
        const formGroup = service.createMvaFormGroup(sampleWithNewData);

        const mva = service.getMva(formGroup) as any;

        expect(mva).toMatchObject(sampleWithNewData);
      });

      it('should return NewMva for empty Mva initial value', () => {
        const formGroup = service.createMvaFormGroup();

        const mva = service.getMva(formGroup) as any;

        expect(mva).toMatchObject({});
      });

      it('should return Mva', () => {
        const formGroup = service.createMvaFormGroup(sampleWithRequiredData);

        const mva = service.getMva(formGroup) as any;

        expect(mva).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Mva should not enable id FormControl', () => {
        const formGroup = service.createMvaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMva should disable id FormControl', () => {
        const formGroup = service.createMvaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
