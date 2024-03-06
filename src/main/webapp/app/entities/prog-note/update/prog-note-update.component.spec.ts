import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProgNoteService } from '../service/prog-note.service';
import { ProgNote } from '../prog-note.model';
import { ProgNoteFormService } from './prog-note-form.service';

import { ProgNoteUpdateComponent } from './prog-note-update.component';

describe('ProgNote Management Update Component', () => {
  let comp: ProgNoteUpdateComponent;
  let fixture: ComponentFixture<ProgNoteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let progNoteFormService: ProgNoteFormService;
  let progNoteService: ProgNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProgNoteUpdateComponent],
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
      .overrideTemplate(ProgNoteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProgNoteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    progNoteFormService = TestBed.inject(ProgNoteFormService);
    progNoteService = TestBed.inject(ProgNoteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const progNote: ProgNote = { id: 456 };

      activatedRoute.data = of({ progNote });
      comp.ngOnInit();

      expect(comp.progNote).toEqual(progNote);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProgNote>>();
      const progNote = { id: 123 };
      jest.spyOn(progNoteFormService, 'getProgNote').mockReturnValue(progNote);
      jest.spyOn(progNoteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ progNote });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: progNote }));
      saveSubject.complete();

      // THEN
      expect(progNoteFormService.getProgNote).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(progNoteService.update).toHaveBeenCalledWith(expect.objectContaining(progNote));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProgNote>>();
      const progNote = { id: 123 };
      jest.spyOn(progNoteFormService, 'getProgNote').mockReturnValue({ id: null });
      jest.spyOn(progNoteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ progNote: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: progNote }));
      saveSubject.complete();

      // THEN
      expect(progNoteFormService.getProgNote).toHaveBeenCalled();
      expect(progNoteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProgNote>>();
      const progNote = { id: 123 };
      jest.spyOn(progNoteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ progNote });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(progNoteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
