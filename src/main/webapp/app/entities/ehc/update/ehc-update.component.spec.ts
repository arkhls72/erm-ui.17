import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EhcService } from '../service/ehc.service';
import { Ehc } from '../ehc.model';
import { EhcFormService } from './ehc-form.service';

import { EhcUpdateComponent } from './ehc-update.component';

describe('Ehc Management Update Component', () => {
  let comp: EhcUpdateComponent;
  let fixture: ComponentFixture<EhcUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ehcFormService: EhcFormService;
  let ehcService: EhcService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), EhcUpdateComponent],
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
      .overrideTemplate(EhcUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EhcUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ehcFormService = TestBed.inject(EhcFormService);
    ehcService = TestBed.inject(EhcService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const ehc: Ehc = { id: 456 };

      activatedRoute.data = of({ ehc });
      comp.ngOnInit();

      expect(comp.ehc).toEqual(ehc);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ehc>>();
      const ehc = { id: 123 };
      jest.spyOn(ehcFormService, 'getEhc').mockReturnValue(ehc);
      jest.spyOn(ehcService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ehc });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ehc }));
      saveSubject.complete();

      // THEN
      expect(ehcFormService.getEhc).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ehcService.update).toHaveBeenCalledWith(expect.objectContaining(ehc));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ehc>>();
      const ehc = { id: 123 };
      jest.spyOn(ehcFormService, 'getEhc').mockReturnValue({ id: null });
      jest.spyOn(ehcService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ehc: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ehc }));
      saveSubject.complete();

      // THEN
      expect(ehcFormService.getEhc).toHaveBeenCalled();
      expect(ehcService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ehc>>();
      const ehc = { id: 123 };
      jest.spyOn(ehcService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ehc });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ehcService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
