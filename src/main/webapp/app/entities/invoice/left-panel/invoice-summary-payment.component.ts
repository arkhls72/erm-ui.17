import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { FeeType } from 'app/entities/fee-type/fee-type.model';
import { CommonServiceCode } from 'app/entities/common-service-code/common-service-code.model';
import { Invoice } from 'app/entities/invoice/invoice.model';

import { Client } from 'app/entities/client/client.model';
import { Item } from 'app/entities/invoice/item.model';
import { MyServiceFee } from 'app/entities/my-service-fee/my-service-fee.model';

import { ServiceInvoice } from 'app/entities/service-invoice/service-invoice.model';

import { LocalStorageService } from 'app/entities/local-share/cache/local-storage.service';
import { MyProductFee } from 'app/entities/my-product-fee/my-product-fee.model';
import { ProductInvoice } from 'app/entities/product-invoice/product-invoice.model';
import { PaymentRightHistoryComponent } from '../payment-history/payment-right-history.component';
import { InvoiceItemDetail } from '../../invocie-item/invoice-Item-detail.model';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { ServiceInvoiceService } from '../../service-invoice/service/service-invoice.service';
import { MyServiceService } from '../../my-service/service/my-service.service';
import { FeeTypeService } from '../../fee-type/service/fee-type.service';
import { InvoiceService } from '../service/invoice.service';
import { InvoiceItemService } from '../../invocie-item/invoice-item.service';
import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-invoice-summary-payment',
  templateUrl: './invoice-summary-payment.component.html',
  imports: [CurrencyPipe, PaymentRightHistoryComponent, NgForOf, NgIf],
})
export class InvoiceSummaryPaymentComponent implements OnInit {
  @ViewChild(PaymentRightHistoryComponent) childPaymentHistory!: PaymentRightHistoryComponent;
  @Input()
  invoice?: Invoice;

  @Output()
  removeEventEmitter = new EventEmitter<Item>();

  @Input()
  client?: Client;

  @Input()
  fromInvoice?: boolean;

  invoiceItemDetail?: InvoiceItemDetail;

  @Input()
  invoiceItems?: Item[];

  @Input()
  myServiceFees?: MyServiceFee[];

  @Input()
  myProductFees?: MyProductFee[];

  @Input()
  feeTypes?: FeeType[];

  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  serviceCodes?: CommonServiceCode[];
  currentSearch!: string;
  serviceInvoices?: ServiceInvoice[] = [];
  productInvoices?: ProductInvoice[] = [];
  grandTotal = 0.0;
  dirty = false;
  constructor(
    protected myServiceService: MyServiceService,
    protected serviceInvoiceService: ServiceInvoiceService,
    protected feeTypeService: FeeTypeService,
    protected activatedRoute: ActivatedRoute,
    protected invoiceService: InvoiceService,
    protected invoiceItemService: InvoiceItemService,
    protected localStorageService: LocalStorageService,
    protected router: Router,
  ) {}

  ngOnInit() {
    if (this.invoice) {
      this.grandTotal = this.invoice.subTotal! + this.invoice.taxTotal!;
    }
  }

  getFeeTypeName(id?: any) {
    const selectedFeeType = this.feeTypes!.find(p => p.id === parseInt(id, 0));
    if (selectedFeeType) {
      return selectedFeeType.name;
    }
    return '';
  }

  previousState(): void {
    window.history.back();
  }

  initPaymentDetails() {
    this.childPaymentHistory.initPayments();
  }

  getFtName(feeTypeId: number) {
    const feeName = this.feeTypes?.find(p => p.id === feeTypeId);
    if (feeName) {
      return feeName.name;
    }
    return '';
  }

  getFee(item?: Item) {
    if (item) {
      if (item.type === 'S') {
        const foundFee = this.myServiceFees?.find(p => p.feeTypeId === item.psFeeTypeId && p.myServiceId === item.psId);
        if (foundFee) {
          return foundFee.fee;
        }
      } else {
        const foundFee = this.myProductFees?.find(p => p.feeTypeId === item.psFeeTypeId && p.myProductId === item.psId);
        if (foundFee) {
          return foundFee.fee;
        }
      }
    }
    return '';
  }
}
