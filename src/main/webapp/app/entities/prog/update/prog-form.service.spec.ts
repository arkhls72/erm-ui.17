import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../prog.test-samples';

import { ProgFormService } from './prog-form.service';

describe('Prog Form Service', () => {
  let service: ProgFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgFormService);
  });

  describe('Service methods', () => {
    describe('createProgFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProgFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            status: expect.any(Object),
            clientId: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            clinicalNote: expect.any(Object),
            assessmentId: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing Prog should create a new form with FormGroup', () => {
        const formGroup = service.createProgFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            status: expect.any(Object),
            clientId: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            clinicalNote: expect.any(Object),
            assessmentId: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getProg', () => {
      it('should return NewProg for default Prog initial value', () => {
        const formGroup = service.createProgFormGroup(sampleWithNewData);

        const prog = service.getProg(formGroup) as any;

        expect(prog).toMatchObject(sampleWithNewData);
      });

      it('should return NewProg for empty Prog initial value', () => {
        const formGroup = service.createProgFormGroup();

        const prog = service.getProg(formGroup) as any;

        expect(prog).toMatchObject({});
      });

      it('should return Prog', () => {
        const formGroup = service.createProgFormGroup(sampleWithRequiredData);

        const prog = service.getProg(formGroup) as any;

        expect(prog).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing Prog should not enable id FormControl', () => {
        const formGroup = service.createProgFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProg should disable id FormControl', () => {
        const formGroup = service.createProgFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
