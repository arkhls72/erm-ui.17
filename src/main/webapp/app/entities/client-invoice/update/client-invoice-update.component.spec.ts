import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClientInvoiceService } from '../service/client-invoice.service';
import { ClientInvoice } from '../client-invoice.model';
import { ClientInvoiceFormService } from './client-invoice-form.service';

import { ClientInvoiceUpdateComponent } from './client-invoice-update.component';

describe('ClientInvoice Management Update Component', () => {
  let comp: ClientInvoiceUpdateComponent;
  let fixture: ComponentFixture<ClientInvoiceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let clientInvoiceFormService: ClientInvoiceFormService;
  let clientInvoiceService: ClientInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ClientInvoiceUpdateComponent],
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
      .overrideTemplate(ClientInvoiceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClientInvoiceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    clientInvoiceFormService = TestBed.inject(ClientInvoiceFormService);
    clientInvoiceService = TestBed.inject(ClientInvoiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const clientInvoice: ClientInvoice = { id: 456 };

      activatedRoute.data = of({ clientInvoice });
      comp.ngOnInit();

      expect(comp.clientInvoice).toEqual(clientInvoice);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClientInvoice>>();
      const clientInvoice = { id: 123 };
      jest.spyOn(clientInvoiceFormService, 'getClientInvoice').mockReturnValue(clientInvoice);
      jest.spyOn(clientInvoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientInvoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clientInvoice }));
      saveSubject.complete();

      // THEN
      expect(clientInvoiceFormService.getClientInvoice).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(clientInvoiceService.update).toHaveBeenCalledWith(expect.objectContaining(clientInvoice));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClientInvoice>>();
      const clientInvoice = { id: 123 };
      jest.spyOn(clientInvoiceFormService, 'getClientInvoice').mockReturnValue({ id: null });
      jest.spyOn(clientInvoiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientInvoice: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clientInvoice }));
      saveSubject.complete();

      // THEN
      expect(clientInvoiceFormService.getClientInvoice).toHaveBeenCalled();
      expect(clientInvoiceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClientInvoice>>();
      const clientInvoice = { id: 123 };
      jest.spyOn(clientInvoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientInvoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(clientInvoiceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
