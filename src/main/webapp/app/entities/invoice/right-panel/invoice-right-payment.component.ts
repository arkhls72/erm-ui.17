import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { HttpResponse } from '@angular/common/http';
import { LocalStorageService } from 'app/entities/local-share/cache/local-storage.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { PaymentInvoice } from 'app/entities/payment-invoice/payment-invoice.model';
import { Invoice } from 'app/entities/invoice/invoice.model';

import { PaymentInvoiceDetails } from 'app/entities/payment-invoice-details/payment-invoice-details.model';
import { InvoiceService } from '../service/invoice.service';
import { PaymentInvoiceDetailsService } from '../../payment-invoice-details/service/payment-invoice-details.service';
import { PaymentInvoiceService } from '../../payment-invoice/service/payment-invoice.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-invoice-right-payment',
  templateUrl: './invoice-right-payment.component.html',
  imports: [ReactiveFormsModule, FaIconComponent, NgIf],
})
export class InvoiceRightPaymentComponent implements OnInit {
  @Input()
  invoice?: Invoice | null;

  @Output()
  loadPaymentDetailEventEmitter = new EventEmitter<PaymentInvoice>();

  @Input()
  paymentInvoice?: PaymentInvoice | null;
  PaymentInvoiceDetails?: PaymentInvoiceDetails;
  grandTotal = 0.0;
  dueNow = this.paymentInvoice?.dueNow;
  status?: string = 'Not paid';
  paymentDetailsList?: PaymentInvoiceDetails[] | null = [];
  paymentMethods: string[] = [];
  note?: string;
  selectedMethod = 'Cash';
  fullPaid = false;
  isCard = false;
  editForm: any;
  constructor(
    protected invoiceService: InvoiceService,
    protected paymentDetailService: PaymentInvoiceDetailsService,
    protected paymentInvoiceService: PaymentInvoiceService,
    protected localStorageService: LocalStorageService,
    private fb: FormBuilder,
    protected router: Router,
  ) {
    this.fullPaid = this.paymentInvoice?.dueNow === 0 ? true : false;
  }

  getMaxValidator() {
    this.dueNow = this.paymentInvoice?.dueNow;
    const due: number = this.dueNow || 0;
    return Validators.max(due);
  }

  getMinValidator() {
    return Validators.min(1);
  }
  ngOnInit() {
    this.editForm = this.fb.group({
      id: [],
      paymentInvoiceId: [null, [Validators.required]],
      paymentAmount: [null, [Validators.required, this.getMinValidator(), this.getMaxValidator()]],
      paymentMethod: [null, [Validators.required]],
      cardNumber: [null, [Validators.required, Validators.maxLength(4)]],
      note: [null, [Validators.maxLength(50)]],
    });
    this.dueNow = this.paymentInvoice && this.paymentInvoice.dueNow ? this.paymentInvoice.dueNow : 0.0;
    this.initPaymentMethod();
    const paymentInvoice = this.paymentInvoice;
    this.initSubmitForms();
    this.paymentDetailService.findByPaymentInvoiceId(paymentInvoice!.id).subscribe(res => {
      this.paymentDetailsList = res.body;
    });
    if (this.paymentInvoice?.status === 'Paid') {
      this.disablePayment();
    }
  }

  initSubmitForms() {
    const x = {} as PaymentInvoiceDetails;
    x.paymentAmount = this.paymentInvoice?.dueNow;
    x.paymentInvoiceId = this.paymentInvoice?.id;
    this.updateForm(x);
  }
  updateForm(paymentInvoiceDetails: PaymentInvoiceDetails): void {
    this.editForm.patchValue({
      id: paymentInvoiceDetails.id,
      paymentInvoiceId: paymentInvoiceDetails.paymentInvoiceId,
      paymentAmount: paymentInvoiceDetails.paymentAmount,
      paymentMethod: this.selectedMethod,
      cardNumber: paymentInvoiceDetails.cardNumber,
      note: paymentInvoiceDetails.note,
    });
  }

  private createFromForm(): PaymentInvoiceDetails {
    const paymentInvoiceDetail: any = {} as PaymentInvoiceDetails;
    paymentInvoiceDetail.id = this.editForm.get(['id'])!.value;
    paymentInvoiceDetail.paymentInvoiceId = this.editForm.get(['paymentInvoiceId'])!.value;
    paymentInvoiceDetail.paymentAmount = this.editForm.get(['paymentAmount'])!.value;
    paymentInvoiceDetail.paymentMethod = this.editForm.get(['paymentMethod'])!.value;
    paymentInvoiceDetail.cardNumber = this.editForm.get(['cardNumber'])!.value;
    paymentInvoiceDetail.note = this.editForm.get(['note'])!.value;

    return paymentInvoiceDetail;
  }

  save() {
    const paymentInvoiceDetails = this.createFromForm();
    paymentInvoiceDetails.paymentMethod = this.selectedMethod;
    this.subscribeToSaveResponse(this.paymentDetailService.create(paymentInvoiceDetails));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<PaymentInvoiceDetails>>): void {
    result.subscribe(res => this.onSaveSuccess(res));
  }

  protected onSaveSuccess(res: HttpResponse<PaymentInvoiceDetails>) {
    const response: PaymentInvoiceDetails | null = res.body;

    if (response && response.paymentInvoiceId) {
      this.paymentInvoiceService.find(response.paymentInvoiceId).subscribe(rs => {
        this.paymentInvoice = rs.body;
        this.dueNow = this.paymentInvoice?.dueNow;
        if (this.paymentInvoice) {
          this.editForm.patchValue({
            paymentAmount: this.paymentInvoice.dueNow,
          });

          if (this.paymentInvoice.status === 'Paid') {
            this.disablePayment();
          }
          this.loadPaymentDetailEventEmitter.emit(this.paymentInvoice);
        }
      });
    }
  }

  changePaymentMethod(target: any) {
    this.selectedMethod = target.value;
    this.editForm.patchValue({
      paymentMethod: this.selectedMethod,
    });

    this.isCard = target.value !== 'Cash' ? true : false;
  }
  initPaymentMethod() {
    this.paymentMethods.push('Debit');
    this.paymentMethods.push('Visa');
    this.paymentMethods.push('Master');
    this.paymentMethods.push('AMX');
    this.paymentMethods.push('Cash');
  }

  getGrandTotal() {
    const subTotal = this.invoice!.subTotal ? this.invoice!.subTotal : 0.0;
    const taxTotal = this.invoice!.taxTotal ? this.invoice!.taxTotal : 0.0;

    return subTotal + taxTotal;
  }

  disablePayment() {
    const x = document.getElementById('myFieldset') as HTMLInputElement;
    x.disabled = true;
  }
}
