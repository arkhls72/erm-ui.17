import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ServiceTypeService } from '../service/service-type.service';
import { ServiceType } from '../service-type.model';
import { ServiceTypeFormService } from './service-type-form.service';

import { ServiceTypeUpdateComponent } from './service-type-update.component';

describe('ServiceType Management Update Component', () => {
  let comp: ServiceTypeUpdateComponent;
  let fixture: ComponentFixture<ServiceTypeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let serviceTypeFormService: ServiceTypeFormService;
  let serviceTypeService: ServiceTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ServiceTypeUpdateComponent],
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
      .overrideTemplate(ServiceTypeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ServiceTypeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    serviceTypeFormService = TestBed.inject(ServiceTypeFormService);
    serviceTypeService = TestBed.inject(ServiceTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const serviceType: ServiceType = { id: 456 };

      activatedRoute.data = of({ serviceType });
      comp.ngOnInit();

      expect(comp.serviceType).toEqual(serviceType);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceType>>();
      const serviceType = { id: 123 };
      jest.spyOn(serviceTypeFormService, 'getServiceType').mockReturnValue(serviceType);
      jest.spyOn(serviceTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceType }));
      saveSubject.complete();

      // THEN
      expect(serviceTypeFormService.getServiceType).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(serviceTypeService.update).toHaveBeenCalledWith(expect.objectContaining(serviceType));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceType>>();
      const serviceType = { id: 123 };
      jest.spyOn(serviceTypeFormService, 'getServiceType').mockReturnValue({ id: null });
      jest.spyOn(serviceTypeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceType: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceType }));
      saveSubject.complete();

      // THEN
      expect(serviceTypeFormService.getServiceType).toHaveBeenCalled();
      expect(serviceTypeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceType>>();
      const serviceType = { id: 123 };
      jest.spyOn(serviceTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(serviceTypeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
