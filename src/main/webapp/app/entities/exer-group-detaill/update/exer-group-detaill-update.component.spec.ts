import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExerGroupDetaillService } from '../service/exer-group-detaill.service';
import { ExerGroupDetaill } from '../exer-group-detaill.model';
import { ExerGroupDetaillFormService } from './exer-group-detaill-form.service';

import { ExerGroupDetaillUpdateComponent } from './exer-group-detaill-update.component';

describe('ExerGroupDetaill Management Update Component', () => {
  let comp: ExerGroupDetaillUpdateComponent;
  let fixture: ComponentFixture<ExerGroupDetaillUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let exerGroupDetaillFormService: ExerGroupDetaillFormService;
  let exerGroupDetaillService: ExerGroupDetaillService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ExerGroupDetaillUpdateComponent],
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
      .overrideTemplate(ExerGroupDetaillUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExerGroupDetaillUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    exerGroupDetaillFormService = TestBed.inject(ExerGroupDetaillFormService);
    exerGroupDetaillService = TestBed.inject(ExerGroupDetaillService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const exerGroupDetaill: ExerGroupDetaill = { id: 456 };

      activatedRoute.data = of({ exerGroupDetaill });
      comp.ngOnInit();

      expect(comp.exerGroupDetaill).toEqual(exerGroupDetaill);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExerGroupDetaill>>();
      const exerGroupDetaill = { id: 123 };
      jest.spyOn(exerGroupDetaillFormService, 'getExerGroupDetaill').mockReturnValue(exerGroupDetaill);
      jest.spyOn(exerGroupDetaillService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exerGroupDetaill });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exerGroupDetaill }));
      saveSubject.complete();

      // THEN
      expect(exerGroupDetaillFormService.getExerGroupDetaill).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(exerGroupDetaillService.update).toHaveBeenCalledWith(expect.objectContaining(exerGroupDetaill));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExerGroupDetaill>>();
      const exerGroupDetaill = { id: 123 };
      jest.spyOn(exerGroupDetaillFormService, 'getExerGroupDetaill').mockReturnValue({ id: null });
      jest.spyOn(exerGroupDetaillService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exerGroupDetaill: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exerGroupDetaill }));
      saveSubject.complete();

      // THEN
      expect(exerGroupDetaillFormService.getExerGroupDetaill).toHaveBeenCalled();
      expect(exerGroupDetaillService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExerGroupDetaill>>();
      const exerGroupDetaill = { id: 123 };
      jest.spyOn(exerGroupDetaillService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exerGroupDetaill });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(exerGroupDetaillService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
