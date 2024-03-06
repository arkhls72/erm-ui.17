import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TherapyService } from '../service/therapy.service';
import { Therapy } from '../therapy.model';
import { TherapyFormService } from './therapy-form.service';

import { TherapyUpdateComponent } from './therapy-update.component';

describe('Therapy Management Update Component', () => {
  let comp: TherapyUpdateComponent;
  let fixture: ComponentFixture<TherapyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let therapyFormService: TherapyFormService;
  let therapyService: TherapyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TherapyUpdateComponent],
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
      .overrideTemplate(TherapyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TherapyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    therapyFormService = TestBed.inject(TherapyFormService);
    therapyService = TestBed.inject(TherapyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const therapy: Therapy = { id: 456 };

      activatedRoute.data = of({ therapy });
      comp.ngOnInit();

      expect(comp.therapy).toEqual(therapy);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Therapy>>();
      const therapy = { id: 123 };
      jest.spyOn(therapyFormService, 'getTherapy').mockReturnValue(therapy);
      jest.spyOn(therapyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ therapy });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: therapy }));
      saveSubject.complete();

      // THEN
      expect(therapyFormService.getTherapy).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(therapyService.update).toHaveBeenCalledWith(expect.objectContaining(therapy));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Therapy>>();
      const therapy = { id: 123 };
      jest.spyOn(therapyFormService, 'getTherapy').mockReturnValue({ id: null });
      jest.spyOn(therapyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ therapy: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: therapy }));
      saveSubject.complete();

      // THEN
      expect(therapyFormService.getTherapy).toHaveBeenCalled();
      expect(therapyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Therapy>>();
      const therapy = { id: 123 };
      jest.spyOn(therapyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ therapy });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(therapyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
