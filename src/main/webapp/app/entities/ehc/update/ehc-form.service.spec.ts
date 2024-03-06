import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../ehc.test-samples';

import { EhcFormService } from './ehc-form.service';

describe('Ehc Form Service', () => {
  let service: EhcFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EhcFormService);
  });

  describe('Service methods', () => {
    describe('createEhcFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEhcFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            certificateNumber: expect.any(Object),
            policyNumber: expect.any(Object),
            policyHolder: expect.any(Object),
            groupNumber: expect.any(Object),
            name: expect.any(Object),
            note: expect.any(Object),
            type: expect.any(Object),
            status: expect.any(Object),
            endDate: expect.any(Object),
            phone: expect.any(Object),
            fax: expect.any(Object),
            email: expect.any(Object),
            clientId: expect.any(Object),
            addressId: expect.any(Object),
            coverages: expect.any(Object),
            ehcClient: expect.any(Object),
            dependents: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing Ehc should create a new form with FormGroup', () => {
        const formGroup = service.createEhcFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            certificateNumber: expect.any(Object),
            policyNumber: expect.any(Object),
            policyHolder: expect.any(Object),
            groupNumber: expect.any(Object),
            name: expect.any(Object),
            note: expect.any(Object),
            type: expect.any(Object),
            status: expect.any(Object),
            endDate: expect.any(Object),
            phone: expect.any(Object),
            fax: expect.any(Object),
            email: expect.any(Object),
            clientId: expect.any(Object),
            addressId: expect.any(Object),
            coverages: expect.any(Object),
            ehcClient: expect.any(Object),
            dependents: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getEhc', () => {
      it('should return NewEhc for default Ehc initial value', () => {
        const formGroup = service.createEhcFormGroup(sampleWithNewData);

        const ehc = service.getEhc(formGroup) as any;

        expect(ehc).toMatchObject(sampleWithNewData);
      });

      it('should return NewEhc for empty Ehc initial value', () => {
        const formGroup = service.createEhcFormGroup();

        const ehc = service.getEhc(formGroup) as any;

        expect(ehc).toMatchObject({});
      });

      it('should return Ehc', () => {
        const formGroup = service.createEhcFormGroup(sampleWithRequiredData);

        const ehc = service.getEhc(formGroup) as any;

        expect(ehc).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Ehc should not enable id FormControl', () => {
        const formGroup = service.createEhcFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEhc should disable id FormControl', () => {
        const formGroup = service.createEhcFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
