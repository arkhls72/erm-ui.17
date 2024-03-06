import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExerciseTypeService } from '../service/exercise-type.service';
import { ExerciseType } from '../exercise-type.model';
import { ExerciseTypeFormService } from './exercise-type-form.service';

import { ExerciseTypeUpdateComponent } from './exercise-type-update.component';

describe('ExerciseType Management Update Component', () => {
  let comp: ExerciseTypeUpdateComponent;
  let fixture: ComponentFixture<ExerciseTypeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let exerciseTypeFormService: ExerciseTypeFormService;
  let exerciseTypeService: ExerciseTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ExerciseTypeUpdateComponent],
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
      .overrideTemplate(ExerciseTypeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExerciseTypeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    exerciseTypeFormService = TestBed.inject(ExerciseTypeFormService);
    exerciseTypeService = TestBed.inject(ExerciseTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const exerciseType: ExerciseType = { id: 456 };

      activatedRoute.data = of({ exerciseType });
      comp.ngOnInit();

      expect(comp.exerciseType).toEqual(exerciseType);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExerciseType>>();
      const exerciseType = { id: 123 };
      jest.spyOn(exerciseTypeFormService, 'getExerciseType').mockReturnValue(exerciseType);
      jest.spyOn(exerciseTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exerciseType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exerciseType }));
      saveSubject.complete();

      // THEN
      expect(exerciseTypeFormService.getExerciseType).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(exerciseTypeService.update).toHaveBeenCalledWith(expect.objectContaining(exerciseType));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExerciseType>>();
      const exerciseType = { id: 123 };
      jest.spyOn(exerciseTypeFormService, 'getExerciseType').mockReturnValue({ id: null });
      jest.spyOn(exerciseTypeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exerciseType: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exerciseType }));
      saveSubject.complete();

      // THEN
      expect(exerciseTypeFormService.getExerciseType).toHaveBeenCalled();
      expect(exerciseTypeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExerciseType>>();
      const exerciseType = { id: 123 };
      jest.spyOn(exerciseTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exerciseType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(exerciseTypeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
