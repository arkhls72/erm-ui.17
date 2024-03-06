import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../soap-note.test-samples';

import { SoapNoteFormService } from './soap-note-form.service';

describe('SoapNote Form Service', () => {
  let service: SoapNoteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoapNoteFormService);
  });

  describe('Service methods', () => {
    describe('createSoapNoteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSoapNoteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            subjective: expect.any(Object),
            objective: expect.any(Object),
            analysis: expect.any(Object),
            evaluation: expect.any(Object),
            intervention: expect.any(Object),
            clientId: expect.any(Object),
            assessments: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing SoapNote should create a new form with FormGroup', () => {
        const formGroup = service.createSoapNoteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            subjective: expect.any(Object),
            objective: expect.any(Object),
            analysis: expect.any(Object),
            evaluation: expect.any(Object),
            intervention: expect.any(Object),
            clientId: expect.any(Object),
            assessments: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getSoapNote', () => {
      it('should return NewSoapNote for default SoapNote initial value', () => {
        const formGroup = service.createSoapNoteFormGroup(sampleWithNewData);

        const soapNote = service.getSoapNote(formGroup) as any;

        expect(soapNote).toMatchObject(sampleWithNewData);
      });

      it('should return NewSoapNote for empty SoapNote initial value', () => {
        const formGroup = service.createSoapNoteFormGroup();

        const soapNote = service.getSoapNote(formGroup) as any;

        expect(soapNote).toMatchObject({});
      });

      it('should return SoapNote', () => {
        const formGroup = service.createSoapNoteFormGroup(sampleWithRequiredData);

        const soapNote = service.getSoapNote(formGroup) as any;

        expect(soapNote).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing SoapNote should not enable id FormControl', () => {
        const formGroup = service.createSoapNoteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSoapNote should disable id FormControl', () => {
        const formGroup = service.createSoapNoteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
