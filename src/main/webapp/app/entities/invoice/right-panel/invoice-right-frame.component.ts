import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FeeType } from 'app/entities/fee-type/fee-type.model';
import { CommonServiceCode } from 'app/entities/common-service-code/common-service-code.model';
import { Invoice } from 'app/entities/invoice/invoice.model';
import { Client } from 'app/entities/client/client.model';
import { Item } from 'app/entities/invoice/item.model';
import { MyServiceFee } from 'app/entities/my-service-fee/my-service-fee.model';
import { ServiceInvoice } from 'app/entities/service-invoice/service-invoice.model';
import { HttpResponse } from '@angular/common/http';
import { LocalStorageService } from 'app/entities/local-share/cache/local-storage.service';
import { MyProductFee } from 'app/entities/my-product-fee/my-product-fee.model';
import { ProductInvoice } from 'app/entities/product-invoice/product-invoice.model';
import { PaymentInvoice } from 'app/entities/payment-invoice/payment-invoice.model';
import { InvoiceItemDetail } from '../../invocie-item/invoice-Item-detail.model';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { MyServiceService } from '../../my-service/service/my-service.service';
import { ServiceInvoiceService } from '../../service-invoice/service/service-invoice.service';
import { FeeTypeService } from '../../fee-type/service/fee-type.service';
import { InvoiceService } from '../service/invoice.service';
import { InvoiceItemService } from '../../invocie-item/invoice-item.service';
import { PaymentInvoiceService } from '../../payment-invoice/service/payment-invoice.service';
import { InvoiceItemSave } from '../../invocie-item/invoiceItemSave.model';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-invoice-right-frame',
  templateUrl: './invoice-right-frame.component.html',
  imports: [FormsModule, FaIconComponent, CurrencyPipe, NgIf, NgForOf],
})
export class InvoiceRightFrameComponent implements OnInit {
  @Input()
  invoice?: Invoice;

  @Output()
  removeEventEmitter = new EventEmitter<Item>();

  @Output()
  paymentEventEmitter = new EventEmitter<PaymentInvoice>();

  @Output()
  itemEventEmitter = new EventEmitter<Item[]>();

  @Output()
  myServiceFeesEventEmitter = new EventEmitter<MyServiceFee[]>();

  @Output()
  myProductFeesEventEmitter = new EventEmitter<MyProductFee[]>();

  @Output()
  feeTypesEventEmitter = new EventEmitter<FeeType[]>();

  @Input()
  client?: Client;

  @Input()
  fromInvoice?: boolean;
  paymentInvoice?: PaymentInvoice | null;
  invoiceItemDetail?: InvoiceItemDetail;
  invoiceItems?: Item[];
  myServiceFees?: MyServiceFee[];
  myProductFees?: MyProductFee[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  feeTypes?: FeeType[];
  serviceCodes?: CommonServiceCode[];
  currentSearch!: string;
  serviceInvoices?: ServiceInvoice[] = [];
  productInvoices?: ProductInvoice[] = [];
  grandTotal = 0.0;
  dirty = false;
  disablePayment = true;
  constructor(
    protected myServiceService: MyServiceService,
    protected serviceInvoiceService: ServiceInvoiceService,
    protected feeTypeService: FeeTypeService,
    protected activatedRoute: ActivatedRoute,
    protected invoiceService: InvoiceService,
    protected invoiceItemService: InvoiceItemService,
    protected localStorageService: LocalStorageService,
    protected paymentInvoiceService: PaymentInvoiceService,
    protected router: Router,
  ) {}

  ngOnInit() {
    if (!this.client) {
      this.client = {} as Client;
    }
    this.onNgStartup();
  }

  public addService(item: Item, selectedMyServiceFees?: MyServiceFee[], feeTypes?: FeeType[]) {
    if (!this.invoiceItems) {
      this.invoiceItems = [];
    }

    const currentItem = this.invoiceItems.find(p => p.psId === item.psId);
    if (currentItem) {
      return;
    }

    if (!this.feeTypes) {
      this.feeTypes = [];
      this.feeTypes = feeTypes;
    } else {
      feeTypes!.forEach(p => {
        if (!this.feeTypes?.find(x => x.id === p.id)) {
          this.feeTypes?.push(p);
        }
      });
    }
    this.invoiceItems?.push(item);
    if (!this.myServiceFees) {
      this.myServiceFees = [];
    }

    selectedMyServiceFees?.forEach(p => {
      const found = this.myServiceFees?.find(x => x.id === p.id);
      if (!found) {
        this.myServiceFees!.push(p);
      }
    });
    this.ifDirty();
    this.calculateInitInvoice();
  }

  public addProduct(item: Item, selectedMyProductFees?: MyProductFee[], feeTypes?: FeeType[]) {
    if (!this.invoiceItems) {
      this.invoiceItems = [];
    }

    const currentItem = this.invoiceItems.find(p => p.psId === item.psId && p.type === 'P');
    if (currentItem) {
      return;
    }

    if (!this.feeTypes) {
      this.feeTypes = [];
    }

    if (!feeTypes) {
      this.feeTypes = feeTypes;
    }

    this.invoiceItems?.push(item);
    if (!this.myProductFees) {
      this.myProductFees = [];
    }

    selectedMyProductFees?.forEach(p => {
      const found = this.myProductFees?.find(x => x.id === p.id);
      if (!found) {
        this.myProductFees!.push(p);
      }
    });
    this.ifDirty();
    this.calculateInitInvoice();
  }

  public calculateInitInvoice() {
    let total = 0.0;
    let subtotal = 0.0;

    this.invoiceItems?.forEach((item: Item) => {
      if (item.type === 'S') {
        total = 0.0;
        const selectedServiceFee = this.myServiceFees?.find(p => p.feeTypeId === item.psFeeTypeId && p.myServiceId === item.psId);
        total = total + Number(selectedServiceFee!.fee) * item.quantity!;
        item.paymentAmount = total;
        subtotal = subtotal + total;
      } else {
        total = 0.0;
        const selectedProductFee = this.myProductFees?.find(p => p.feeTypeId === item.psFeeTypeId && p.myProductId === item.psId);
        total = total + Number(selectedProductFee!.fee) * item.quantity!;
        item.paymentAmount = total;
        subtotal = subtotal + total;
      }
    });

    subtotal = Math.round((subtotal + Number.EPSILON) * 100) / 100;
    const taxTotal = Math.round((subtotal + Number.EPSILON) * 0.13 * 100) / 100;

    this.invoice!.subTotal = subtotal;
    this.invoice!.taxTotal = taxTotal;

    this.grandTotal = subtotal + taxTotal;
    this.disablePayment = this.dirty || this.invoice?.status === 'Paid' || (subtotal === 0 && taxTotal === 0) ? true : false;
  }

  public removeItemLine(item: Item) {
    const disable = this.invoice?.status === 'Paid' || this.invoice?.status === 'In progress';
    if (!disable) {
      this.removeItem(item);
      this.removeEventEmitter.emit(item);
    }
  }
  public removeItem(item: Item) {
    this.invoiceItems = this.invoiceItems?.filter(p => p.psId !== item.psId && p.name !== item.name);
    this.ifDirty();
    this.calculateInitInvoice();
  }

  public onNgStartup() {
    this.invoiceItemService.findItemsByInvoiceId(this.invoice!.id).subscribe(res => {
      if (res && res.body) {
        this.invoiceItemDetail = res.body;
        this.invoiceItems = this.invoiceItemDetail?.items;
        this.myServiceFees = this.invoiceItemDetail?.myServiceFees;
        this.myProductFees = this.invoiceItemDetail?.myProductFees;
        this.feeTypes = this.invoiceItemDetail.feeTypes;
        this.localStorageService.addItemInvoicePersist(this.invoiceItems);
        this.dirty = false;
        this.calculateInitInvoice();
      }
    });
  }

  refreshItem() {
    this.dirty = false;
    this.invoiceItems = this.localStorageService.getItemInvoicePersist();
    this.calculateInitInvoice();
  }
  getServiceCode(myService: any) {
    const serviceCodes: any = this.serviceCodes;
    const foundServiceCode = serviceCodes.find((p: { id: number | undefined }) => p.id === myService.commonServiceCodeId);
    if (foundServiceCode) {
      return foundServiceCode.serviceCode;
    }
    return '';
  }

  // changeFeeType(event: Event,item: Item) {
  changeFeeType(index: number, item: Item) {
    const fieldTypeIndex = 'field_feeType_' + index;
    const selectedFeeTypeId: any = (document.getElementById(fieldTypeIndex) as HTMLInputElement).value;

    if (selectedFeeTypeId) {
      // find the actual feeType object
      const selectedFeeType = this.feeTypes!.find(p => p.id === parseInt(selectedFeeTypeId, 0));
      if (selectedFeeType) {
        const newFee =
          item.type === 'S'
            ? this.myServiceFees?.find(s => s.feeTypeId === selectedFeeType.id && s.myServiceId === item.psId)
            : this.myProductFees?.find(p => p.feeTypeId === selectedFeeType.id && p.myProductId === item.psId);
        this.invoiceItems![index].psFeeTypeId = selectedFeeType.id;
        this.invoiceItems![index].paymentAmount = newFee!.fee! * item.quantity!;
        this.ifDirty();
        this.calculateInitInvoice();
      }
    }
  }

  save() {
    const request: InvoiceItemSave = {} as InvoiceItemSave;
    const persistedItems: Item[] = this.localStorageService.getItemInvoicePersist();
    this.serviceInvoices = [];
    this.productInvoices = [];
    this.invoiceItems!.forEach((item: Item) => {
      const services = {} as ServiceInvoice;
      const product = {} as ProductInvoice;

      if (item.type === 'S') {
        const persistedItem = persistedItems.find(p => p.psId === item.psId && p.type === item.type);

        if (persistedItem) {
          const servicesId: any = persistedItem.itemId;
          services.id = servicesId;
        } else {
          const servicesId: any = item.itemId;
          services.id = servicesId;
        }

        services.invoiceId = this.invoice!.id;
        services.quantity = item.quantity;
        services.invoicePrice = item.quantity! * item.paymentAmount!;
        services.myServiceId = item.psId;
        const myServiceFee: any = this.myServiceFees?.find(p => p.myServiceId === item.psId && p.feeTypeId === item.psFeeTypeId);
        services.myServiceFeeId = myServiceFee.id;
        this.serviceInvoices!.push(services);
      } else {
        const persistedItem = persistedItems.find(p => p.psId === item.psId && p.type === item.type);
        if (persistedItem) {
          const productId: any = persistedItem.itemId;
          product.id = productId;
        }
        product.invoiceId = this.invoice!.id;
        product.quantity = item.quantity;
        product.invoicePrice = item.quantity! * item.paymentAmount!;
        product.myProductId = item.psId;
        const myProductFee: any = this.myProductFees?.find(p => p.myProductId === item.psId && p.feeTypeId === item.psFeeTypeId);
        product.myProductFeeId = myProductFee.id;
        this.productInvoices!.push(product);
      }
    });
    request.invoiceId = this.invoice!.id;
    request.serviceInvoices = this.serviceInvoices;
    request.productInvoices = this.productInvoices;

    this.subscribeToSaveResponse(this.invoiceItemService.updateItems(request));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<InvoiceItemDetail>>): void {
    result.subscribe(res => this.onSaveSuccess(res));
  }

  protected onSaveSuccess(res: HttpResponse<InvoiceItemDetail>) {
    if (res && res.body) {
      this.invoiceItemDetail = res.body;
      // ItemPersist
      this.invoiceItems = this.invoiceItemDetail?.items;
      this.myServiceFees = this.invoiceItemDetail?.myServiceFees;
      this.myProductFees = this.invoiceItemDetail.myProductFees;
      this.feeTypes = this.invoiceItemDetail.feeTypes;
      this.invoice = this.invoiceItemDetail.invoice;
      this.localStorageService.addItemInvoicePersist(this.invoiceItems);
      this.dirty = false;
      this.calculateInitInvoice();
    }
  }

  ifDirty() {
    const previousItems: Item[] = this.localStorageService.getItemInvoicePersist();

    const previousItemSize = !previousItems ? 0 : previousItems.length;
    const invoiceItemsSize = !this.invoiceItems ? 0 : this.invoiceItems.length;
    if (previousItemSize !== invoiceItemsSize) {
      this.dirty = true;
      return;
    }
    let index = 0;
    if (previousItems) {
      if (previousItems && this.invoiceItems && previousItems.length !== this.invoiceItems.length) {
        this.dirty = true;
        return;
      } else {
        for (let i = 0; i < this.invoiceItems!.length && index === 0; i++) {
          const found = previousItems?.find(p => p.psId === this.invoiceItems![i].psId && p.type === this.invoiceItems![i].type);
          if (!found) {
            index = 1;
            this.dirty = true;
          }
        }
      }
    }
    if (index === 1 && this.dirty) {
      return;
    }

    // means the previous and new are the same.
    if (this.invoiceItems) {
      this.invoiceItems.forEach((item: Item) => {
        const found = previousItems?.find(p => p.psId === item.id && p.type === item.type);
        if (!found || found.quantity !== item.quantity || found.psFeeTypeId !== item.psFeeTypeId) {
          this.dirty = true;
        }
      });
    }
    index = 0;
    if (this.invoiceItems) {
      for (let j = 0; j < this.invoiceItems.length && index === 0; j++) {
        const found = previousItems?.find(p => p.psId === this.invoiceItems![j].psId && p.type === this.invoiceItems![j].type);
        if (!found || found.quantity !== this.invoiceItems[j].quantity || found.psFeeTypeId !== this.invoiceItems[j].psFeeTypeId) {
          index = 1;
        }
      }
    }

    if (index === 1) {
      return;
    }
    this.dirty = false;
  }

  changeQuantity() {
    this.ifDirty();
    this.calculateInitInvoice();
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
  changeInvoicePage() {
    this.paymentInvoiceService.findByInvoiceId(this.invoice!.id).subscribe(res => {
      this.paymentInvoice = res.body;
      this.paymentEventEmitter.emit(this.paymentInvoice!);
      this.itemEventEmitter.emit(this.invoiceItems);
      this.myServiceFeesEventEmitter.emit(this.myServiceFees);
      this.myProductFeesEventEmitter.emit(this.myProductFees);
      this.feeTypesEventEmitter.emit(this.feeTypes);
    });
  }
}
