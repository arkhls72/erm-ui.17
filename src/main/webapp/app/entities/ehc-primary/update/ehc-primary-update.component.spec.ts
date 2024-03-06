import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EhcPrimaryService } from '../service/ehc-primary.service';
import { EhcPrimary } from '../ehc-primary.model';
import { EhcPrimaryFormService } from './ehc-primary-form.service';

import { EhcPrimaryUpdateComponent } from './ehc-primary-update.component';

describe('EhcPrimary Management Update Component', () => {
  let comp: EhcPrimaryUpdateComponent;
  let fixture: ComponentFixture<EhcPrimaryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ehcPrimaryFormService: EhcPrimaryFormService;
  let ehcPrimaryService: EhcPrimaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), EhcPrimaryUpdateComponent],
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
      .overrideTemplate(EhcPrimaryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EhcPrimaryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ehcPrimaryFormService = TestBed.inject(EhcPrimaryFormService);
    ehcPrimaryService = TestBed.inject(EhcPrimaryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const ehcPrimary: EhcPrimary = { id: 456 };

      activatedRoute.data = of({ ehcPrimary });
      comp.ngOnInit();

      expect(comp.ehcPrimary).toEqual(ehcPrimary);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EhcPrimary>>();
      const ehcPrimary = { id: 123 };
      jest.spyOn(ehcPrimaryFormService, 'getEhcPrimary').mockReturnValue(ehcPrimary);
      jest.spyOn(ehcPrimaryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ehcPrimary });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ehcPrimary }));
      saveSubject.complete();

      // THEN
      expect(ehcPrimaryFormService.getEhcPrimary).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ehcPrimaryService.update).toHaveBeenCalledWith(expect.objectContaining(ehcPrimary));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EhcPrimary>>();
      const ehcPrimary = { id: 123 };
      jest.spyOn(ehcPrimaryFormService, 'getEhcPrimary').mockReturnValue({ id: null });
      jest.spyOn(ehcPrimaryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ehcPrimary: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ehcPrimary }));
      saveSubject.complete();

      // THEN
      expect(ehcPrimaryFormService.getEhcPrimary).toHaveBeenCalled();
      expect(ehcPrimaryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EhcPrimary>>();
      const ehcPrimary = { id: 123 };
      jest.spyOn(ehcPrimaryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ehcPrimary });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ehcPrimaryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
