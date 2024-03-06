import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProvinceService } from '../service/province.service';
import { Province } from '../province.model';
import { ProvinceFormService } from './province-form.service';

import { ProvinceUpdateComponent } from './province-update.component';

describe('Province Management Update Component', () => {
  let comp: ProvinceUpdateComponent;
  let fixture: ComponentFixture<ProvinceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let provinceFormService: ProvinceFormService;
  let provinceService: ProvinceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProvinceUpdateComponent],
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
      .overrideTemplate(ProvinceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProvinceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    provinceFormService = TestBed.inject(ProvinceFormService);
    provinceService = TestBed.inject(ProvinceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const province: Province = { id: 456 };

      activatedRoute.data = of({ province });
      comp.ngOnInit();

      expect(comp.province).toEqual(province);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Province>>();
      const province = { id: 123 };
      jest.spyOn(provinceFormService, 'getProvince').mockReturnValue(province);
      jest.spyOn(provinceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ province });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: province }));
      saveSubject.complete();

      // THEN
      expect(provinceFormService.getProvince).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(provinceService.update).toHaveBeenCalledWith(expect.objectContaining(province));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Province>>();
      const province = { id: 123 };
      jest.spyOn(provinceFormService, 'getProvince').mockReturnValue({ id: null });
      jest.spyOn(provinceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ province: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: province }));
      saveSubject.complete();

      // THEN
      expect(provinceFormService.getProvince).toHaveBeenCalled();
      expect(provinceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Province>>();
      const province = { id: 123 };
      jest.spyOn(provinceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ province });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(provinceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
