import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Invoice } from 'app/entities/invoice/invoice.model';
import { LocalStorageService } from 'app/entities/local-share/cache/local-storage.service';
import { PaymentInvoice } from 'app/entities/payment-invoice/payment-invoice.model';
import { PaymentInvoiceDetails } from 'app/entities/payment-invoice-details/payment-invoice-details.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceItemDetail } from '../../invocie-item/invoice-Item-detail.model';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { PaymentInvoiceDetailsService } from '../../payment-invoice-details/service/payment-invoice-details.service';
import { CurrencyPipe, DatePipe, NgForOf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-payment-right-history',
  templateUrl: './payment-right-history.component.html',
  imports: [DatePipe, CurrencyPipe, NgForOf],
})
export class PaymentRightHistoryComponent implements OnInit {
  payments?: PaymentInvoiceDetails[] | null;
  @Input()
  invoice?: Invoice;
  paymentInvoice?: PaymentInvoice | null;
  invoiceItemDetail?: InvoiceItemDetail;

  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  grandTotal = 0.0;
  dirty = false;
  disablePayment = true;
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected localStorageService: LocalStorageService,
    protected paymentDetailService: PaymentInvoiceDetailsService,
    protected modalService: NgbModal,
    protected router: Router,
  ) {}

  ngOnInit() {
    this.initPayments();
  }

  initPayments() {
    this.paymentDetailService.findByInvoiceId(this.invoice!.id).subscribe(res => {
      this.payments = res.body;
    });
  }
}
