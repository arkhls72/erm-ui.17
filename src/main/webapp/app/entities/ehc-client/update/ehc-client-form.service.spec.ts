import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../ehc-client.test-samples';

import { EhcClientFormService } from './ehc-client-form.service';

describe('EhcClient Form Service', () => {
  let service: EhcClientFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EhcClientFormService);
  });

  describe('Service methods', () => {
    describe('createEhcClientFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEhcClientFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            ehcType: expect.any(Object),
            policyHolder: expect.any(Object),
            clientId: expect.any(Object),
            ehcId: expect.any(Object),
            endDate: expect.any(Object),
            ehcPrimaryId: expect.any(Object),
            note: expect.any(Object),
            relation: expect.any(Object),
            status: expect.any(Object),
            removedDate: expect.any(Object),
            lastModfiedDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
          }),
        );
      });

      it('passing EhcClient should create a new form with FormGroup', () => {
        const formGroup = service.createEhcClientFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            ehcType: expect.any(Object),
            policyHolder: expect.any(Object),
            clientId: expect.any(Object),
            ehcId: expect.any(Object),
            endDate: expect.any(Object),
            ehcPrimaryId: expect.any(Object),
            note: expect.any(Object),
            relation: expect.any(Object),
            status: expect.any(Object),
            removedDate: expect.any(Object),
            lastModfiedDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getEhcClient', () => {
      it('should return NewEhcClient for default EhcClient initial value', () => {
        const formGroup = service.createEhcClientFormGroup(sampleWithNewData);

        const ehcClient = service.getEhcClient(formGroup) as any;

        expect(ehcClient).toMatchObject(sampleWithNewData);
      });

      it('should return NewEhcClient for empty EhcClient initial value', () => {
        const formGroup = service.createEhcClientFormGroup();

        const ehcClient = service.getEhcClient(formGroup) as any;

        expect(ehcClient).toMatchObject({});
      });

      it('should return EhcClient', () => {
        const formGroup = service.createEhcClientFormGroup(sampleWithRequiredData);

        const ehcClient = service.getEhcClient(formGroup) as any;

        expect(ehcClient).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing EhcClient should not enable id FormControl', () => {
        const formGroup = service.createEhcClientFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEhcClient should disable id FormControl', () => {
        const formGroup = service.createEhcClientFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
