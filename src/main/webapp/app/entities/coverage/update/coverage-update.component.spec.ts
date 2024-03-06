import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CoverageFormService } from './coverage-form.service';
import { CoverageService } from '../service/coverage.service';
import { Coverage } from '../coverage.model';

import { CoverageUpdateComponent } from './coverage-update.component';

describe('Coverage Management Update Component', () => {
  let comp: CoverageUpdateComponent;
  let fixture: ComponentFixture<CoverageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let coverageFormService: CoverageFormService;
  let coverageService: CoverageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CoverageUpdateComponent],
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
      .overrideTemplate(CoverageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CoverageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    coverageFormService = TestBed.inject(CoverageFormService);
    coverageService = TestBed.inject(CoverageService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const coverage: Coverage = { id: 456 };

      activatedRoute.data = of({ coverage });
      comp.ngOnInit();

      expect(comp.coverage).toEqual(coverage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Coverage>>();
      const coverage = { id: 123 };
      jest.spyOn(coverageFormService, 'getCoverage').mockReturnValue(coverage);
      jest.spyOn(coverageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ coverage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: coverage }));
      saveSubject.complete();

      // THEN
      expect(coverageFormService.getCoverage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(coverageService.update).toHaveBeenCalledWith(expect.objectContaining(coverage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Coverage>>();
      const coverage = { id: 123 };
      jest.spyOn(coverageFormService, 'getCoverage').mockReturnValue({ id: null });
      jest.spyOn(coverageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ coverage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: coverage }));
      saveSubject.complete();

      // THEN
      expect(coverageFormService.getCoverage).toHaveBeenCalled();
      expect(coverageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Coverage>>();
      const coverage = { id: 123 };
      jest.spyOn(coverageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ coverage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(coverageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
