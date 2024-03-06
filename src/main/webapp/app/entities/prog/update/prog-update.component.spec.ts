import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProgService } from '../service/prog.service';
import { Prog } from '../prog.model';
import { ProgFormService } from './prog-form.service';

import { ProgUpdateComponent } from './prog-update.component';

describe('Prog Management Update Component', () => {
  let comp: ProgUpdateComponent;
  let fixture: ComponentFixture<ProgUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let progFormService: ProgFormService;
  let progService: ProgService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProgUpdateComponent],
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
      .overrideTemplate(ProgUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProgUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    progFormService = TestBed.inject(ProgFormService);
    progService = TestBed.inject(ProgService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const prog: Prog = { id: 456 };

      activatedRoute.data = of({ prog });
      comp.ngOnInit();

      expect(comp.prog).toEqual(prog);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Prog>>();
      const prog = { id: 123 };
      jest.spyOn(progFormService, 'getProg').mockReturnValue(prog);
      jest.spyOn(progService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prog });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prog }));
      saveSubject.complete();

      // THEN
      expect(progFormService.getProg).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(progService.update).toHaveBeenCalledWith(expect.objectContaining(prog));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Prog>>();
      const prog = { id: 123 };
      jest.spyOn(progFormService, 'getProg').mockReturnValue({ id: null });
      jest.spyOn(progService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prog: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prog }));
      saveSubject.complete();

      // THEN
      expect(progFormService.getProg).toHaveBeenCalled();
      expect(progService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Prog>>();
      const prog = { id: 123 };
      jest.spyOn(progService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prog });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(progService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
