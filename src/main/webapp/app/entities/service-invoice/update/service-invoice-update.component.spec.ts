import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ServiceInvoiceService } from '../service/service-invoice.service';
import { ServiceInvoice } from '../service-invoice.model';
import { ServiceInvoiceFormService } from './service-invoice-form.service';

import { ServiceInvoiceUpdateComponent } from './service-invoice-update.component';

describe('ServiceInvoice Management Update Component', () => {
  let comp: ServiceInvoiceUpdateComponent;
  let fixture: ComponentFixture<ServiceInvoiceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let serviceInvoiceFormService: ServiceInvoiceFormService;
  let serviceInvoiceService: ServiceInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ServiceInvoiceUpdateComponent],
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
      .overrideTemplate(ServiceInvoiceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ServiceInvoiceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    serviceInvoiceFormService = TestBed.inject(ServiceInvoiceFormService);
    serviceInvoiceService = TestBed.inject(ServiceInvoiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const serviceInvoice: ServiceInvoice = { id: 456 };

      activatedRoute.data = of({ serviceInvoice });
      comp.ngOnInit();

      expect(comp.serviceInvoice).toEqual(serviceInvoice);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceInvoice>>();
      const serviceInvoice = { id: 123 };
      jest.spyOn(serviceInvoiceFormService, 'getServiceInvoice').mockReturnValue(serviceInvoice);
      jest.spyOn(serviceInvoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceInvoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceInvoice }));
      saveSubject.complete();

      // THEN
      expect(serviceInvoiceFormService.getServiceInvoice).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(serviceInvoiceService.update).toHaveBeenCalledWith(expect.objectContaining(serviceInvoice));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceInvoice>>();
      const serviceInvoice = { id: 123 };
      jest.spyOn(serviceInvoiceFormService, 'getServiceInvoice').mockReturnValue({ id: null });
      jest.spyOn(serviceInvoiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceInvoice: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceInvoice }));
      saveSubject.complete();

      // THEN
      expect(serviceInvoiceFormService.getServiceInvoice).toHaveBeenCalled();
      expect(serviceInvoiceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceInvoice>>();
      const serviceInvoice = { id: 123 };
      jest.spyOn(serviceInvoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceInvoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(serviceInvoiceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
