import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InstructionService } from '../service/instruction.service';
import { Instruction } from '../instruction.model';
import { InstructionFormService } from './instruction-form.service';

import { InstructionUpdateComponent } from './instruction-update.component';

describe('Instruction Management Update Component', () => {
  let comp: InstructionUpdateComponent;
  let fixture: ComponentFixture<InstructionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let instructionFormService: InstructionFormService;
  let instructionService: InstructionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), InstructionUpdateComponent],
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
      .overrideTemplate(InstructionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InstructionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    instructionFormService = TestBed.inject(InstructionFormService);
    instructionService = TestBed.inject(InstructionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const instruction: Instruction = { id: 456 };

      activatedRoute.data = of({ instruction });
      comp.ngOnInit();

      expect(comp.instruction).toEqual(instruction);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Instruction>>();
      const instruction = { id: 123 };
      jest.spyOn(instructionFormService, 'getInstruction').mockReturnValue(instruction);
      jest.spyOn(instructionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ instruction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: instruction }));
      saveSubject.complete();

      // THEN
      expect(instructionFormService.getInstruction).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(instructionService.update).toHaveBeenCalledWith(expect.objectContaining(instruction));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Instruction>>();
      const instruction = { id: 123 };
      jest.spyOn(instructionFormService, 'getInstruction').mockReturnValue({ id: null });
      jest.spyOn(instructionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ instruction: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: instruction }));
      saveSubject.complete();

      // THEN
      expect(instructionFormService.getInstruction).toHaveBeenCalled();
      expect(instructionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Instruction>>();
      const instruction = { id: 123 };
      jest.spyOn(instructionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ instruction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(instructionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
