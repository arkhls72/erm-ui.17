import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../ehc-primary.test-samples';

import { EhcPrimaryFormService } from './ehc-primary-form.service';

describe('EhcPrimary Form Service', () => {
  let service: EhcPrimaryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EhcPrimaryFormService);
  });

  describe('Service methods', () => {
    describe('createEhcPrimaryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEhcPrimaryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            ehcId: expect.any(Object),
            clientId: expect.any(Object),
            name: expect.any(Object),
            status: expect.any(Object),
            ehcType: expect.any(Object),
            groupNumber: expect.any(Object),
            policyNumber: expect.any(Object),
            policyHolder: expect.any(Object),
            certificateNumber: expect.any(Object),
            note: expect.any(Object),
            endDate: expect.any(Object),
            phone: expect.any(Object),
            fax: expect.any(Object),
            email: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
          }),
        );
      });

      it('passing EhcPrimary should create a new form with FormGroup', () => {
        const formGroup = service.createEhcPrimaryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            ehcId: expect.any(Object),
            clientId: expect.any(Object),
            name: expect.any(Object),
            status: expect.any(Object),
            ehcType: expect.any(Object),
            groupNumber: expect.any(Object),
            policyNumber: expect.any(Object),
            policyHolder: expect.any(Object),
            certificateNumber: expect.any(Object),
            note: expect.any(Object),
            endDate: expect.any(Object),
            phone: expect.any(Object),
            fax: expect.any(Object),
            email: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getEhcPrimary', () => {
      it('should return NewEhcPrimary for default EhcPrimary initial value', () => {
        const formGroup = service.createEhcPrimaryFormGroup(sampleWithNewData);

        const ehcPrimary = service.getEhcPrimary(formGroup) as any;

        expect(ehcPrimary).toMatchObject(sampleWithNewData);
      });

      it('should return NewEhcPrimary for empty EhcPrimary initial value', () => {
        const formGroup = service.createEhcPrimaryFormGroup();

        const ehcPrimary = service.getEhcPrimary(formGroup) as any;

        expect(ehcPrimary).toMatchObject({});
      });

      it('should return EhcPrimary', () => {
        const formGroup = service.createEhcPrimaryFormGroup(sampleWithRequiredData);

        const ehcPrimary = service.getEhcPrimary(formGroup) as any;

        expect(ehcPrimary).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing EhcPrimary should not enable id FormControl', () => {
        const formGroup = service.createEhcPrimaryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEhcPrimary should disable id FormControl', () => {
        const formGroup = service.createEhcPrimaryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
