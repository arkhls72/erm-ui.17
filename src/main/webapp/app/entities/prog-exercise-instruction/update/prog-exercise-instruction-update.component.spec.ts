import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProgExerciseInstructionService } from '../service/prog-exercise-instruction.service';
import { ProgExerciseInstruction } from '../prog-exercise-instruction.model';
import { ProgExerciseInstructionFormService } from './prog-exercise-instruction-form.service';

import { ProgExerciseInstructionUpdateComponent } from './prog-exercise-instruction-update.component';

describe('ProgExerciseInstruction Management Update Component', () => {
  let comp: ProgExerciseInstructionUpdateComponent;
  let fixture: ComponentFixture<ProgExerciseInstructionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let progExerciseInstructionFormService: ProgExerciseInstructionFormService;
  let progExerciseInstructionService: ProgExerciseInstructionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProgExerciseInstructionUpdateComponent],
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
      .overrideTemplate(ProgExerciseInstructionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProgExerciseInstructionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    progExerciseInstructionFormService = TestBed.inject(ProgExerciseInstructionFormService);
    progExerciseInstructionService = TestBed.inject(ProgExerciseInstructionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const progExerciseInstruction: ProgExerciseInstruction = { id: 456 };

      activatedRoute.data = of({ progExerciseInstruction });
      comp.ngOnInit();

      expect(comp.progExerciseInstruction).toEqual(progExerciseInstruction);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProgExerciseInstruction>>();
      const progExerciseInstruction = { id: 123 };
      jest.spyOn(progExerciseInstructionFormService, 'getProgExerciseInstruction').mockReturnValue(progExerciseInstruction);
      jest.spyOn(progExerciseInstructionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ progExerciseInstruction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: progExerciseInstruction }));
      saveSubject.complete();

      // THEN
      expect(progExerciseInstructionFormService.getProgExerciseInstruction).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(progExerciseInstructionService.update).toHaveBeenCalledWith(expect.objectContaining(progExerciseInstruction));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProgExerciseInstruction>>();
      const progExerciseInstruction = { id: 123 };
      jest.spyOn(progExerciseInstructionFormService, 'getProgExerciseInstruction').mockReturnValue({ id: null });
      jest.spyOn(progExerciseInstructionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ progExerciseInstruction: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: progExerciseInstruction }));
      saveSubject.complete();

      // THEN
      expect(progExerciseInstructionFormService.getProgExerciseInstruction).toHaveBeenCalled();
      expect(progExerciseInstructionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProgExerciseInstruction>>();
      const progExerciseInstruction = { id: 123 };
      jest.spyOn(progExerciseInstructionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ progExerciseInstruction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(progExerciseInstructionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
