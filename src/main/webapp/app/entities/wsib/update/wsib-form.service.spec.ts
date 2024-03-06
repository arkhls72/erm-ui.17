import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../wsib.test-samples';

import { WsibFormService } from './wsib-form.service';

describe('Wsib Form Service', () => {
  let service: WsibFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WsibFormService);
  });

  describe('Service methods', () => {
    describe('createWsibFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createWsibFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            employer: expect.any(Object),
            claimNumber: expect.any(Object),
            clientId: expect.any(Object),
            supervisor: expect.any(Object),
            accidentDate: expect.any(Object),
            adjudicator: expect.any(Object),
            caseManager: expect.any(Object),
            status: expect.any(Object),
            phone: expect.any(Object),
            phoneExtension: expect.any(Object),
            cellPhone: expect.any(Object),
            closeDate: expect.any(Object),
            note: expect.any(Object),
            fax: expect.any(Object),
            coverages: expect.any(Object),
            email: expect.any(Object),
            addressId: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing Wsib should create a new form with FormGroup', () => {
        const formGroup = service.createWsibFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            employer: expect.any(Object),
            claimNumber: expect.any(Object),
            clientId: expect.any(Object),
            supervisor: expect.any(Object),
            accidentDate: expect.any(Object),
            adjudicator: expect.any(Object),
            caseManager: expect.any(Object),
            status: expect.any(Object),
            phone: expect.any(Object),
            phoneExtension: expect.any(Object),
            cellPhone: expect.any(Object),
            closeDate: expect.any(Object),
            note: expect.any(Object),
            fax: expect.any(Object),
            coverages: expect.any(Object),
            email: expect.any(Object),
            addressId: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getWsib', () => {
      it('should return NewWsib for default Wsib initial value', () => {
        const formGroup = service.createWsibFormGroup(sampleWithNewData);

        const wsib = service.getWsib(formGroup) as any;

        expect(wsib).toMatchObject(sampleWithNewData);
      });

      it('should return NewWsib for empty Wsib initial value', () => {
        const formGroup = service.createWsibFormGroup();

        const wsib = service.getWsib(formGroup) as any;

        expect(wsib).toMatchObject({});
      });

      it('should return Wsib', () => {
        const formGroup = service.createWsibFormGroup(sampleWithRequiredData);

        const wsib = service.getWsib(formGroup) as any;

        expect(wsib).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Wsib should not enable id FormControl', () => {
        const formGroup = service.createWsibFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewWsib should disable id FormControl', () => {
        const formGroup = service.createWsibFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
