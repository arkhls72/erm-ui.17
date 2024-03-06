import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExerciseToolService } from '../service/exercise-tool.service';
import { ExerciseTool } from '../exercise-tool.model';
import { ExerciseToolFormService } from './exercise-tool-form.service';

import { ExerciseToolUpdateComponent } from './exercise-tool-update.component';

describe('ExerciseTool Management Update Component', () => {
  let comp: ExerciseToolUpdateComponent;
  let fixture: ComponentFixture<ExerciseToolUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let exerciseToolFormService: ExerciseToolFormService;
  let exerciseToolService: ExerciseToolService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ExerciseToolUpdateComponent],
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
      .overrideTemplate(ExerciseToolUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExerciseToolUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    exerciseToolFormService = TestBed.inject(ExerciseToolFormService);
    exerciseToolService = TestBed.inject(ExerciseToolService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const exerciseTool: ExerciseTool = { id: 456 };

      activatedRoute.data = of({ exerciseTool });
      comp.ngOnInit();

      expect(comp.exerciseTool).toEqual(exerciseTool);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExerciseTool>>();
      const exerciseTool = { id: 123 };
      jest.spyOn(exerciseToolFormService, 'getExerciseTool').mockReturnValue(exerciseTool);
      jest.spyOn(exerciseToolService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exerciseTool });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exerciseTool }));
      saveSubject.complete();

      // THEN
      expect(exerciseToolFormService.getExerciseTool).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(exerciseToolService.update).toHaveBeenCalledWith(expect.objectContaining(exerciseTool));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExerciseTool>>();
      const exerciseTool = { id: 123 };
      jest.spyOn(exerciseToolFormService, 'getExerciseTool').mockReturnValue({ id: null });
      jest.spyOn(exerciseToolService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exerciseTool: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exerciseTool }));
      saveSubject.complete();

      // THEN
      expect(exerciseToolFormService.getExerciseTool).toHaveBeenCalled();
      expect(exerciseToolService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExerciseTool>>();
      const exerciseTool = { id: 123 };
      jest.spyOn(exerciseToolService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exerciseTool });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(exerciseToolService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
