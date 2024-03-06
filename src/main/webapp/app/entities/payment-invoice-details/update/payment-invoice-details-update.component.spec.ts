import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PaymentInvoiceDetailsService } from '../service/payment-invoice-details.service';
import { PaymentInvoiceDetails } from '../payment-invoice-details.model';
import { PaymentInvoiceDetailsFormService } from './payment-invoice-details-form.service';

import { PaymentInvoiceDetailsUpdateComponent } from './payment-invoice-details-update.component';

describe('PaymentInvoiceDetails Management Update Component', () => {
  let comp: PaymentInvoiceDetailsUpdateComponent;
  let fixture: ComponentFixture<PaymentInvoiceDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paymentInvoiceDetailsFormService: PaymentInvoiceDetailsFormService;
  let paymentInvoiceDetailsService: PaymentInvoiceDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PaymentInvoiceDetailsUpdateComponent],
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
      .overrideTemplate(PaymentInvoiceDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PaymentInvoiceDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paymentInvoiceDetailsFormService = TestBed.inject(PaymentInvoiceDetailsFormService);
    paymentInvoiceDetailsService = TestBed.inject(PaymentInvoiceDetailsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const paymentInvoiceDetails: PaymentInvoiceDetails = { id: 456 };

      activatedRoute.data = of({ paymentInvoiceDetails });
      comp.ngOnInit();

      expect(comp.paymentInvoiceDetails).toEqual(paymentInvoiceDetails);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentInvoiceDetails>>();
      const paymentInvoiceDetails = { id: 123 };
      jest.spyOn(paymentInvoiceDetailsFormService, 'getPaymentInvoiceDetails').mockReturnValue(paymentInvoiceDetails);
      jest.spyOn(paymentInvoiceDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentInvoiceDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paymentInvoiceDetails }));
      saveSubject.complete();

      // THEN
      expect(paymentInvoiceDetailsFormService.getPaymentInvoiceDetails).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(paymentInvoiceDetailsService.update).toHaveBeenCalledWith(expect.objectContaining(paymentInvoiceDetails));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentInvoiceDetails>>();
      const paymentInvoiceDetails = { id: 123 };
      jest.spyOn(paymentInvoiceDetailsFormService, 'getPaymentInvoiceDetails').mockReturnValue({ id: null });
      jest.spyOn(paymentInvoiceDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentInvoiceDetails: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paymentInvoiceDetails }));
      saveSubject.complete();

      // THEN
      expect(paymentInvoiceDetailsFormService.getPaymentInvoiceDetails).toHaveBeenCalled();
      expect(paymentInvoiceDetailsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentInvoiceDetails>>();
      const paymentInvoiceDetails = { id: 123 };
      jest.spyOn(paymentInvoiceDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentInvoiceDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paymentInvoiceDetailsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
