import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExerciseLevelService } from '../service/exercise-level.service';
import { ExerciseLevel } from '../exercise-level.model';
import { ExerciseLevelFormService } from './exercise-level-form.service';

import { ExerciseLevelUpdateComponent } from './exercise-level-update.component';

describe('ExerciseLevel Management Update Component', () => {
  let comp: ExerciseLevelUpdateComponent;
  let fixture: ComponentFixture<ExerciseLevelUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let exerciseLevelFormService: ExerciseLevelFormService;
  let exerciseLevelService: ExerciseLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ExerciseLevelUpdateComponent],
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
      .overrideTemplate(ExerciseLevelUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExerciseLevelUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    exerciseLevelFormService = TestBed.inject(ExerciseLevelFormService);
    exerciseLevelService = TestBed.inject(ExerciseLevelService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const exerciseLevel: ExerciseLevel = { id: 456 };

      activatedRoute.data = of({ exerciseLevel });
      comp.ngOnInit();

      expect(comp.exerciseLevel).toEqual(exerciseLevel);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExerciseLevel>>();
      const exerciseLevel = { id: 123 };
      jest.spyOn(exerciseLevelFormService, 'getExerciseLevel').mockReturnValue(exerciseLevel);
      jest.spyOn(exerciseLevelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exerciseLevel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exerciseLevel }));
      saveSubject.complete();

      // THEN
      expect(exerciseLevelFormService.getExerciseLevel).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(exerciseLevelService.update).toHaveBeenCalledWith(expect.objectContaining(exerciseLevel));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExerciseLevel>>();
      const exerciseLevel = { id: 123 };
      jest.spyOn(exerciseLevelFormService, 'getExerciseLevel').mockReturnValue({ id: null });
      jest.spyOn(exerciseLevelService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exerciseLevel: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exerciseLevel }));
      saveSubject.complete();

      // THEN
      expect(exerciseLevelFormService.getExerciseLevel).toHaveBeenCalled();
      expect(exerciseLevelService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExerciseLevel>>();
      const exerciseLevel = { id: 123 };
      jest.spyOn(exerciseLevelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exerciseLevel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(exerciseLevelService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
