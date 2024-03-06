import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PaymentInvoice } from '../payment-invoice.model';
import { PaymentInvoiceService } from '../service/payment-invoice.service';
import { PaymentInvoiceFormService, PaymentInvoiceFormGroup } from './payment-invoice-form.service';

@Component({
  standalone: true,
  selector: 'jhi-payment-invoice-update',
  templateUrl: './payment-invoice-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PaymentInvoiceUpdateComponent implements OnInit {
  isSaving = false;
  paymentInvoice: PaymentInvoice | null = null;

  editForm: PaymentInvoiceFormGroup = this.paymentInvoiceFormService.createPaymentInvoiceFormGroup();

  constructor(
    protected paymentInvoiceService: PaymentInvoiceService,
    protected paymentInvoiceFormService: PaymentInvoiceFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentInvoice }) => {
      this.paymentInvoice = paymentInvoice;
      if (paymentInvoice) {
        this.updateForm(paymentInvoice);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paymentInvoice = this.paymentInvoiceFormService.getPaymentInvoice(this.editForm);
    if (paymentInvoice.id !== null) {
      this.subscribeToSaveResponse(this.paymentInvoiceService.update(paymentInvoice));
    } else {
      this.subscribeToSaveResponse(this.paymentInvoiceService.create(paymentInvoice));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<PaymentInvoice>>): void {
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

  protected updateForm(paymentInvoice: PaymentInvoice): void {
    this.paymentInvoice = paymentInvoice;
    this.paymentInvoiceFormService.resetForm(this.editForm, paymentInvoice);
  }
}
