import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PlanNoteService } from '../service/plan-note.service';
import { PlanNote } from '../plan-note.model';
import { PlanNoteFormService } from './plan-note-form.service';

import { PlanNoteUpdateComponent } from './plan-note-update.component';

describe('PlanNote Management Update Component', () => {
  let comp: PlanNoteUpdateComponent;
  let fixture: ComponentFixture<PlanNoteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let planNoteFormService: PlanNoteFormService;
  let planNoteService: PlanNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PlanNoteUpdateComponent],
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
      .overrideTemplate(PlanNoteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlanNoteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    planNoteFormService = TestBed.inject(PlanNoteFormService);
    planNoteService = TestBed.inject(PlanNoteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const planNote: PlanNote = { id: 456 };

      activatedRoute.data = of({ planNote });
      comp.ngOnInit();

      expect(comp.planNote).toEqual(planNote);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PlanNote>>();
      const planNote = { id: 123 };
      jest.spyOn(planNoteFormService, 'getPlanNote').mockReturnValue(planNote);
      jest.spyOn(planNoteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ planNote });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: planNote }));
      saveSubject.complete();

      // THEN
      expect(planNoteFormService.getPlanNote).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(planNoteService.update).toHaveBeenCalledWith(expect.objectContaining(planNote));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PlanNote>>();
      const planNote = { id: 123 };
      jest.spyOn(planNoteFormService, 'getPlanNote').mockReturnValue({ id: null });
      jest.spyOn(planNoteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ planNote: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: planNote }));
      saveSubject.complete();

      // THEN
      expect(planNoteFormService.getPlanNote).toHaveBeenCalled();
      expect(planNoteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PlanNote>>();
      const planNote = { id: 123 };
      jest.spyOn(planNoteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ planNote });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(planNoteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
