import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OrderPayment } from '../order-payment.model';
import { OrderPaymentService } from '../service/order-payment.service';
import { OrderPaymentFormService, OrderPaymentFormGroup } from './order-payment-form.service';

@Component({
  standalone: true,
  selector: 'jhi-order-payment-update',
  templateUrl: './order-payment-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class OrderPaymentUpdateComponent implements OnInit {
  isSaving = false;
  orderPayment: OrderPayment | null = null;

  editForm: OrderPaymentFormGroup = this.orderPaymentFormService.createOrderPaymentFormGroup();

  constructor(
    protected orderPaymentService: OrderPaymentService,
    protected orderPaymentFormService: OrderPaymentFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderPayment }) => {
      this.orderPayment = orderPayment;
      if (orderPayment) {
        this.updateForm(orderPayment);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderPayment = this.orderPaymentFormService.getOrderPayment(this.editForm);
    if (orderPayment.id !== null) {
      this.subscribeToSaveResponse(this.orderPaymentService.update(orderPayment));
    } else {
      this.subscribeToSaveResponse(this.orderPaymentService.create(orderPayment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<OrderPayment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(orderPayment: OrderPayment): void {
    this.orderPayment = orderPayment;
    this.orderPaymentFormService.resetForm(this.editForm, orderPayment);
  }
}
