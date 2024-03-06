import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PaymentInvoiceService } from '../service/payment-invoice.service';
import { PaymentInvoice } from '../payment-invoice.model';
import { PaymentInvoiceFormService } from './payment-invoice-form.service';

import { PaymentInvoiceUpdateComponent } from './payment-invoice-update.component';

describe('PaymentInvoice Management Update Component', () => {
  let comp: PaymentInvoiceUpdateComponent;
  let fixture: ComponentFixture<PaymentInvoiceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paymentInvoiceFormService: PaymentInvoiceFormService;
  let paymentInvoiceService: PaymentInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PaymentInvoiceUpdateComponent],
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
      .overrideTemplate(PaymentInvoiceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PaymentInvoiceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paymentInvoiceFormService = TestBed.inject(PaymentInvoiceFormService);
    paymentInvoiceService = TestBed.inject(PaymentInvoiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const paymentInvoice: PaymentInvoice = { id: 456 };

      activatedRoute.data = of({ paymentInvoice });
      comp.ngOnInit();

      expect(comp.paymentInvoice).toEqual(paymentInvoice);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentInvoice>>();
      const paymentInvoice = { id: 123 };
      jest.spyOn(paymentInvoiceFormService, 'getPaymentInvoice').mockReturnValue(paymentInvoice);
      jest.spyOn(paymentInvoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentInvoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paymentInvoice }));
      saveSubject.complete();

      // THEN
      expect(paymentInvoiceFormService.getPaymentInvoice).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(paymentInvoiceService.update).toHaveBeenCalledWith(expect.objectContaining(paymentInvoice));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentInvoice>>();
      const paymentInvoice = { id: 123 };
      jest.spyOn(paymentInvoiceFormService, 'getPaymentInvoice').mockReturnValue({ id: null });
      jest.spyOn(paymentInvoiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentInvoice: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paymentInvoice }));
      saveSubject.complete();

      // THEN
      expect(paymentInvoiceFormService.getPaymentInvoice).toHaveBeenCalled();
      expect(paymentInvoiceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentInvoice>>();
      const paymentInvoice = { id: 123 };
      jest.spyOn(paymentInvoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentInvoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paymentInvoiceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
