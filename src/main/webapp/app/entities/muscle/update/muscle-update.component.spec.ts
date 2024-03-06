import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MuscleService } from '../service/muscle.service';
import { Muscle } from '../muscle.model';
import { MuscleFormService } from './muscle-form.service';

import { MuscleUpdateComponent } from './muscle-update.component';

describe('Muscle Management Update Component', () => {
  let comp: MuscleUpdateComponent;
  let fixture: ComponentFixture<MuscleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let muscleFormService: MuscleFormService;
  let muscleService: MuscleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MuscleUpdateComponent],
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
      .overrideTemplate(MuscleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MuscleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    muscleFormService = TestBed.inject(MuscleFormService);
    muscleService = TestBed.inject(MuscleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const muscle: Muscle = { id: 456 };

      activatedRoute.data = of({ muscle });
      comp.ngOnInit();

      expect(comp.muscle).toEqual(muscle);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Muscle>>();
      const muscle = { id: 123 };
      jest.spyOn(muscleFormService, 'getMuscle').mockReturnValue(muscle);
      jest.spyOn(muscleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ muscle });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: muscle }));
      saveSubject.complete();

      // THEN
      expect(muscleFormService.getMuscle).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(muscleService.update).toHaveBeenCalledWith(expect.objectContaining(muscle));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Muscle>>();
      const muscle = { id: 123 };
      jest.spyOn(muscleFormService, 'getMuscle').mockReturnValue({ id: null });
      jest.spyOn(muscleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ muscle: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: muscle }));
      saveSubject.complete();

      // THEN
      expect(muscleFormService.getMuscle).toHaveBeenCalled();
      expect(muscleService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Muscle>>();
      const muscle = { id: 123 };
      jest.spyOn(muscleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ muscle });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(muscleService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
