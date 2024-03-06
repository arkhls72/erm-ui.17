import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PaymentInvoiceDetails } from '../payment-invoice-details.model';
import { PaymentInvoiceDetailsService } from '../service/payment-invoice-details.service';
import { PaymentInvoiceDetailsFormService, PaymentInvoiceDetailsFormGroup } from './payment-invoice-details-form.service';

@Component({
  standalone: true,
  selector: 'jhi-payment-invoice-details-update',
  templateUrl: './payment-invoice-details-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PaymentInvoiceDetailsUpdateComponent implements OnInit {
  isSaving = false;
  paymentInvoiceDetails: PaymentInvoiceDetails | null = null;

  editForm: PaymentInvoiceDetailsFormGroup = this.paymentInvoiceDetailsFormService.createPaymentInvoiceDetailsFormGroup();

  constructor(
    protected paymentInvoiceDetailsService: PaymentInvoiceDetailsService,
    protected paymentInvoiceDetailsFormService: PaymentInvoiceDetailsFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentInvoiceDetails }) => {
      this.paymentInvoiceDetails = paymentInvoiceDetails;
      if (paymentInvoiceDetails) {
        this.updateForm(paymentInvoiceDetails);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paymentInvoiceDetails = this.paymentInvoiceDetailsFormService.getPaymentInvoiceDetails(this.editForm);
    if (paymentInvoiceDetails.id !== null) {
      this.subscribeToSaveResponse(this.paymentInvoiceDetailsService.update(paymentInvoiceDetails));
    } else {
      this.subscribeToSaveResponse(this.paymentInvoiceDetailsService.create(paymentInvoiceDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<PaymentInvoiceDetails>>): void {
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

  protected updateForm(paymentInvoiceDetails: PaymentInvoiceDetails): void {
    this.paymentInvoiceDetails = paymentInvoiceDetails;
    this.paymentInvoiceDetailsFormService.resetForm(this.editForm, paymentInvoiceDetails);
  }
}
