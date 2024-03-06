import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SoapNoteService } from '../service/soap-note.service';
import { SoapNote } from '../soap-note.model';
import { SoapNoteFormService } from './soap-note-form.service';

import { SoapNoteUpdateComponent } from './soap-note-update.component';

describe('SoapNote Management Update Component', () => {
  let comp: SoapNoteUpdateComponent;
  let fixture: ComponentFixture<SoapNoteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let soapNoteFormService: SoapNoteFormService;
  let soapNoteService: SoapNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), SoapNoteUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SoapNoteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SoapNoteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    soapNoteFormService = TestBed.inject(SoapNoteFormService);
    soapNoteService = TestBed.inject(SoapNoteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const soapNote: SoapNote = { id: 456 };

      activatedRoute.data = of({ soapNote });
      comp.ngOnInit();

      expect(comp.soapNote).toEqual(soapNote);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SoapNote>>();
      const soapNote = { id: 123 };
      jest.spyOn(soapNoteFormService, 'getSoapNote').mockReturnValue(soapNote);
      jest.spyOn(soapNoteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ soapNote });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: soapNote }));
      saveSubject.complete();

      // THEN
      expect(soapNoteFormService.getSoapNote).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(soapNoteService.update).toHaveBeenCalledWith(expect.objectContaining(soapNote));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SoapNote>>();
      const soapNote = { id: 123 };
      jest.spyOn(soapNoteFormService, 'getSoapNote').mockReturnValue({ id: null });
      jest.spyOn(soapNoteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ soapNote: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: soapNote }));
      saveSubject.complete();

      // THEN
      expect(soapNoteFormService.getSoapNote).toHaveBeenCalled();
      expect(soapNoteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SoapNote>>();
      const soapNote = { id: 123 };
      jest.spyOn(soapNoteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ soapNote });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(soapNoteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
