import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../prog-note.test-samples';

import { ProgNoteFormService } from './prog-note-form.service';

describe('ProgNote Form Service', () => {
  let service: ProgNoteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgNoteFormService);
  });

  describe('Service methods', () => {
    describe('createProgNoteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProgNoteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            progId: expect.any(Object),
            note: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing ProgNote should create a new form with FormGroup', () => {
        const formGroup = service.createProgNoteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            progId: expect.any(Object),
            note: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getProgNote', () => {
      it('should return NewProgNote for default ProgNote initial value', () => {
        const formGroup = service.createProgNoteFormGroup(sampleWithNewData);

        const progNote = service.getProgNote(formGroup) as any;

        expect(progNote).toMatchObject(sampleWithNewData);
      });

      it('should return NewProgNote for empty ProgNote initial value', () => {
        const formGroup = service.createProgNoteFormGroup();

        const progNote = service.getProgNote(formGroup) as any;

        expect(progNote).toMatchObject({});
      });

      it('should return ProgNote', () => {
        const formGroup = service.createProgNoteFormGroup(sampleWithRequiredData);

        const progNote = service.getProgNote(formGroup) as any;

        expect(progNote).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ProgNote should not enable id FormControl', () => {
        const formGroup = service.createProgNoteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProgNote should disable id FormControl', () => {
        const formGroup = service.createProgNoteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
