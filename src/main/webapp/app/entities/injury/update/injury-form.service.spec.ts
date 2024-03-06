import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../injury.test-samples';

import { InjuryFormService } from './injury-form.service';

describe('Injury Form Service', () => {
  let service: InjuryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InjuryFormService);
  });

  describe('Service methods', () => {
    describe('createInjuryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInjuryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nameType: expect.any(Object),
            happenDate: expect.any(Object),
            note: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing Injury should create a new form with FormGroup', () => {
        const formGroup = service.createInjuryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nameType: expect.any(Object),
            happenDate: expect.any(Object),
            note: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getInjury', () => {
      it('should return NewInjury for default Injury initial value', () => {
        const formGroup = service.createInjuryFormGroup(sampleWithNewData);

        const injury = service.getInjury(formGroup) as any;

        expect(injury).toMatchObject(sampleWithNewData);
      });

      it('should return NewInjury for empty Injury initial value', () => {
        const formGroup = service.createInjuryFormGroup();

        const injury = service.getInjury(formGroup) as any;

        expect(injury).toMatchObject({});
      });

      it('should return Injury', () => {
        const formGroup = service.createInjuryFormGroup(sampleWithRequiredData);

        const injury = service.getInjury(formGroup) as any;

        expect(injury).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Injury should not enable id FormControl', () => {
        const formGroup = service.createInjuryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInjury should disable id FormControl', () => {
        const formGroup = service.createInjuryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
