import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrderPaymentService } from '../service/order-payment.service';
import { OrderPayment } from '../order-payment.model';
import { OrderPaymentFormService } from './order-payment-form.service';

import { OrderPaymentUpdateComponent } from './order-payment-update.component';

describe('OrderPayment Management Update Component', () => {
  let comp: OrderPaymentUpdateComponent;
  let fixture: ComponentFixture<OrderPaymentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orderPaymentFormService: OrderPaymentFormService;
  let orderPaymentService: OrderPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), OrderPaymentUpdateComponent],
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
      .overrideTemplate(OrderPaymentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderPaymentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orderPaymentFormService = TestBed.inject(OrderPaymentFormService);
    orderPaymentService = TestBed.inject(OrderPaymentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const orderPayment: OrderPayment = { id: 456 };

      activatedRoute.data = of({ orderPayment });
      comp.ngOnInit();

      expect(comp.orderPayment).toEqual(orderPayment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrderPayment>>();
      const orderPayment = { id: 123 };
      jest.spyOn(orderPaymentFormService, 'getOrderPayment').mockReturnValue(orderPayment);
      jest.spyOn(orderPaymentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderPayment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderPayment }));
      saveSubject.complete();

      // THEN
      expect(orderPaymentFormService.getOrderPayment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(orderPaymentService.update).toHaveBeenCalledWith(expect.objectContaining(orderPayment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrderPayment>>();
      const orderPayment = { id: 123 };
      jest.spyOn(orderPaymentFormService, 'getOrderPayment').mockReturnValue({ id: null });
      jest.spyOn(orderPaymentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderPayment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderPayment }));
      saveSubject.complete();

      // THEN
      expect(orderPaymentFormService.getOrderPayment).toHaveBeenCalled();
      expect(orderPaymentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrderPayment>>();
      const orderPayment = { id: 123 };
      jest.spyOn(orderPaymentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderPayment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orderPaymentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
