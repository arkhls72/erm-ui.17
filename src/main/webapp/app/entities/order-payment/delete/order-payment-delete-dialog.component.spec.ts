jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { OrderPaymentService } from '../service/order-payment.service';

import { OrderPaymentDeleteDialogComponent } from './order-payment-delete-dialog.component';

describe('OrderPayment Management Delete Component', () => {
  let comp: OrderPaymentDeleteDialogComponent;
  let fixture: ComponentFixture<OrderPaymentDeleteDialogComponent>;
  let service: OrderPaymentService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OrderPaymentDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(OrderPaymentDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OrderPaymentDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OrderPaymentService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      }),
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
