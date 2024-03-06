import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CommonServiceCodeService } from '../service/common-service-code.service';
import { CommonServiceCode } from '../common-service-code.model';
import { CommonServiceCodeFormService } from './common-service-code-form.service';

import { CommonServiceCodeUpdateComponent } from './common-service-code-update.component';

describe('CommonServiceCode Management Update Component', () => {
  let comp: CommonServiceCodeUpdateComponent;
  let fixture: ComponentFixture<CommonServiceCodeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let commonServiceCodeFormService: CommonServiceCodeFormService;
  let commonServiceCodeService: CommonServiceCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CommonServiceCodeUpdateComponent],
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
      .overrideTemplate(CommonServiceCodeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommonServiceCodeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    commonServiceCodeFormService = TestBed.inject(CommonServiceCodeFormService);
    commonServiceCodeService = TestBed.inject(CommonServiceCodeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const commonServiceCode: CommonServiceCode = { id: 456 };

      activatedRoute.data = of({ commonServiceCode });
      comp.ngOnInit();

      expect(comp.commonServiceCode).toEqual(commonServiceCode);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CommonServiceCode>>();
      const commonServiceCode = { id: 123 };
      jest.spyOn(commonServiceCodeFormService, 'getCommonServiceCode').mockReturnValue(commonServiceCode);
      jest.spyOn(commonServiceCodeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commonServiceCode });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: commonServiceCode }));
      saveSubject.complete();

      // THEN
      expect(commonServiceCodeFormService.getCommonServiceCode).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(commonServiceCodeService.update).toHaveBeenCalledWith(expect.objectContaining(commonServiceCode));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CommonServiceCode>>();
      const commonServiceCode = { id: 123 };
      jest.spyOn(commonServiceCodeFormService, 'getCommonServiceCode').mockReturnValue({ id: null });
      jest.spyOn(commonServiceCodeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commonServiceCode: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: commonServiceCode }));
      saveSubject.complete();

      // THEN
      expect(commonServiceCodeFormService.getCommonServiceCode).toHaveBeenCalled();
      expect(commonServiceCodeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CommonServiceCode>>();
      const commonServiceCode = { id: 123 };
      jest.spyOn(commonServiceCodeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commonServiceCode });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(commonServiceCodeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
