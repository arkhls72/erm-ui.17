import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProgGroupInstructionService } from '../service/prog-group-instruction.service';
import { ProgGroupInstruction } from '../prog-group-instruction.model';
import { ProgGroupInstructionFormService } from './prog-group-instruction-form.service';

import { ProgGroupInstructionUpdateComponent } from './prog-group-instruction-update.component';

describe('ProgGroupInstruction Management Update Component', () => {
  let comp: ProgGroupInstructionUpdateComponent;
  let fixture: ComponentFixture<ProgGroupInstructionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let progGroupInstructionFormService: ProgGroupInstructionFormService;
  let progGroupInstructionService: ProgGroupInstructionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProgGroupInstructionUpdateComponent],
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
      .overrideTemplate(ProgGroupInstructionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProgGroupInstructionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    progGroupInstructionFormService = TestBed.inject(ProgGroupInstructionFormService);
    progGroupInstructionService = TestBed.inject(ProgGroupInstructionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const progGroupInstruction: ProgGroupInstruction = { id: 456 };

      activatedRoute.data = of({ progGroupInstruction });
      comp.ngOnInit();

      expect(comp.progGroupInstruction).toEqual(progGroupInstruction);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProgGroupInstruction>>();
      const progGroupInstruction = { id: 123 };
      jest.spyOn(progGroupInstructionFormService, 'getProgGroupInstruction').mockReturnValue(progGroupInstruction);
      jest.spyOn(progGroupInstructionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ progGroupInstruction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: progGroupInstruction }));
      saveSubject.complete();

      // THEN
      expect(progGroupInstructionFormService.getProgGroupInstruction).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(progGroupInstructionService.update).toHaveBeenCalledWith(expect.objectContaining(progGroupInstruction));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProgGroupInstruction>>();
      const progGroupInstruction = { id: 123 };
      jest.spyOn(progGroupInstructionFormService, 'getProgGroupInstruction').mockReturnValue({ id: null });
      jest.spyOn(progGroupInstructionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ progGroupInstruction: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: progGroupInstruction }));
      saveSubject.complete();

      // THEN
      expect(progGroupInstructionFormService.getProgGroupInstruction).toHaveBeenCalled();
      expect(progGroupInstructionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProgGroupInstruction>>();
      const progGroupInstruction = { id: 123 };
      jest.spyOn(progGroupInstructionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ progGroupInstruction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(progGroupInstructionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
