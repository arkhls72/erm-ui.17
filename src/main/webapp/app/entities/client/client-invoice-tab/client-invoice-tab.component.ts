import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Invoice } from 'app/entities/invoice/invoice.model';

import { Client } from 'app/entities/client/client.model';
import { InvoicePageType } from 'app/entities/local-share/invoice-page';
import { ServiceInvoice } from 'app/entities/service-invoice/service-invoice.model';
import { InvoiceNavigateType } from 'app/entities/local-share/invoice-navigate';

import { Item } from 'app/entities/invoice/item.model';

import { MyService } from 'app/entities/my-service/my-service.model';
import { Product } from 'app/entities/product/product.model';
import { PaymentInvoice } from 'app/entities/payment-invoice/payment-invoice.model';
import { ProductInvoice } from 'app/entities/product-invoice/product-invoice.model';
import { MyServiceFee } from 'app/entities/my-service-fee/my-service-fee.model';
import { MyProductFee } from 'app/entities/my-product-fee/my-product-fee.model';
import { FeeType } from 'app/entities/fee-type/fee-type.model';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { InvoiceAddProductComponent } from '../../invoice/left-panel/invoice-add-product.component';
import { InvoiceRightFrameComponent } from '../../invoice/right-panel/invoice-right-frame.component';
import { InvoiceAddServiceComponent } from '../../invoice/left-panel/invoice-add-service.component';
import { InvoiceSummaryPaymentComponent } from '../../invoice/left-panel/invoice-summary-payment.component';
import { InvoiceService } from '../../invoice/service/invoice.service';
import { LocalStorageService } from '../../local-share/cache/local-storage.service';
import { ServiceInvoiceService } from '../../service-invoice/service/service-invoice.service';
import { ProductInvoiceService } from '../../product-invoice/service/product-invoice.service';
import { ProductService } from '../../product/service/product.service';
import { MyServiceService } from '../../my-service/service/my-service.service';
import { ClientService } from '../service/client.service';
import { PaymentInvoiceService } from '../../payment-invoice/service/payment-invoice.service';
import { ModifyProductItem } from '../../invocie-item/modifyProductItem.model';
import { ModifyServiceItem } from '../../invocie-item/modifyServiceItem.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { InvoiceRightPaymentComponent } from '../../invoice/right-panel/invoice-right-payment.component';
import { ClientInvoiceDeleteComponent } from '../../invoice/invoice-delete/client-invoice-delete.component';
import { ItemCountComponent } from '../../../shared/pagination';
import SharedModule from '../../../shared/shared.module';
import SortDirective from '../../../shared/sort/sort.directive';
import { SortByDirective } from '../../../shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../shared/date';

@Component({
  standalone: true,
  selector: 'bc-client-invoice-tab',
  templateUrl: './client-invoice-tab.component.html',
  imports: [
    FaIconComponent,
    CurrencyPipe,
    InvoiceAddServiceComponent,
    InvoiceAddProductComponent,
    InvoiceRightFrameComponent,
    InvoiceSummaryPaymentComponent,
    InvoiceRightPaymentComponent,
    ClientInvoiceDeleteComponent,
    CommonModule,
    ItemCountComponent,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    SortDirective,
  ],
})
export class ClientInvoiceTabComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @Input()
  client?: Client;

  selectedInvoice?: Invoice;

  fromInvoice = false;

  invoices?: Invoice[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  currentSearch?: string;
  // ***************************************  Invoice ************************************************
  ifClientTab = true;
  isTherapy = true;
  invoicePage: InvoicePageType = InvoicePageType.INVOICE_LIST;
  displayServiceInvoices?: ServiceInvoice[];
  productInvoices: ProductInvoice[] = [];
  selectedProducts?: Product[] = [];
  paymentInvoice?: PaymentInvoice | null;
  dueNow?: number;

  invoiceItems?: Item[];
  feeTypes?: FeeType[];
  myProductFees?: MyProductFee[];
  myServiceFees?: MyServiceFee[];

  invoice?: Invoice;

  @ViewChild(InvoiceAddProductComponent) childInvoiceAddProduct!: InvoiceAddProductComponent;
  @ViewChild(InvoiceRightFrameComponent) childInvoiceRightFrame!: InvoiceRightFrameComponent;
  @ViewChild(InvoiceAddServiceComponent) childInvoiceAddService!: InvoiceAddServiceComponent;
  @ViewChild(InvoiceSummaryPaymentComponent) childInvoiceAddPayment!: InvoiceSummaryPaymentComponent;

  constructor(
    protected invoiceService: InvoiceService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected localStorageService: LocalStorageService,
    protected serviceInvoiceService: ServiceInvoiceService,
    protected productInvoiceService: ProductInvoiceService,
    protected productService: ProductService,
    protected myServiceService: MyServiceService,
    protected clientService: ClientService,
    protected paymentInvoiceService: PaymentInvoiceService,
  ) {}

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page || 1;

    this.invoiceService
      .queryByClient(
        {
          query: this.currentSearch ? this.currentSearch : '',
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        },
        this.client!.id,
      )
      .subscribe(
        (res: HttpResponse<Invoice[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
        () => this.onError(),
      );
  }

  ngOnInit(): void {
    this.handleNavigation();
    this.loadPage(1);
  }

  protected handleNavigation(): void {
    combineLatest(this.activatedRoute.data, this.activatedRoute.queryParamMap, (data: Data, params: ParamMap) => {
      const defaultSort: string[] = [];
      defaultSort.push('id');
      defaultSort.push('asc');

      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort =
        params.get('sort') !== null && params.get('sort') !== undefined
          ? (params.get('sort') ?? data['defaultSort']).split(',')
          : defaultSort;
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber);
      }
    }).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackId(index: number, item: Invoice): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  delete(invoice: Invoice): void {
    this.invoice = invoice;
    this.invoicePage = InvoicePageType.INVOICE_DELETE;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: Invoice[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.invoices = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  search(query: string) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadPage(this.page);
  }
  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.loadPage();
  }

  createInvoice() {
    this.localStorageService.cleanUpLocalStorage();
    const invoice = {} as Invoice;
    invoice.clientId = this.client!.id;
    invoice.status = 'Draft';
    invoice.taxTotal = 0.0;
    invoice.subTotal = 0.0;
    invoice.clinicId = 1;
    this.subscribeToSaveResponse(this.invoiceService.create(invoice));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Invoice>>): void {
    result.subscribe(res => this.onSaveSuccess(res));
  }
  protected onSaveSuccess(res: HttpResponse<Invoice>) {
    const invoice = res.body!;
    this.selectedInvoice = invoice;
    this.initStartup();
    this.invoicePage = InvoicePageType.INVOICE;
    this.loadPage(this.page);
  }
  // ***********************************************************************************************************************
  // ********************************************************   Invoice   **************************************************
  // *********************************************************************************************************************** //

  invoiceDetail(invoice?: Invoice) {
    this.invoicePage = InvoicePageType.INVOICE;
    this.selectedInvoice = invoice;
    this.localStorageService.cleanUpLocalStorage();
    this.localStorageService.addNavType(InvoiceNavigateType.FROM_INVOICE.toString());
    if (invoice) {
      this.paymentInvoiceService.findByInvoiceId(invoice.id).subscribe(resp => {
        this.paymentInvoice = resp.body;
      });
      this.initStartup();
    }
  }
  initStartup() {
    this.localStorageService.addNavType(InvoiceNavigateType.FROM_INVOICE.toString());
    let myPersistedServiceCache: MyService[] | null = [];
    this.myServiceService.findByInvoiceId(this.selectedInvoice?.id).subscribe((resp: { body: MyService[] | null }) => {
      myPersistedServiceCache = resp.body;
      this.localStorageService.addMyServiceSelected(myPersistedServiceCache!);
      this.localStorageService.addMyServiceSelectedPersists(myPersistedServiceCache!);
    });

    this.startup();
    if (!this.client) {
      this.clientService.findByInvoice(this.selectedInvoice!.id).subscribe(res => {
        this.client = res.body || undefined;
      });
    }
  }
  startup() {
    if (this.isTherapy) {
      const navType: string = this.localStorageService.getNavType();
      if (!navType || navType === InvoiceNavigateType.FROM_INVOICE.toString()) {
        this.serviceInvoiceService.findByInvoiceId(this.selectedInvoice!.id).subscribe(res => {
          this.displayServiceInvoices = res.body || [];
          this.localStorageService.addServiceInInvoice(this.displayServiceInvoices);
          // by default service button is selected
          this.localStorageService.addNavType(InvoiceNavigateType.FROM_SERVICE.toString());
        });
      }
    } else {
      const navType: string = this.localStorageService.getNavType();
      if (!navType || navType === InvoiceNavigateType.FROM_SERVICE.toString()) {
        this.productInvoiceService.findByInvoiceId(this.selectedInvoice!.id).subscribe(res => {
          this.productInvoices = res.body || [];
          this.localStorageService.addProductInInvoice(this.productInvoices);
          this.localStorageService.addNavType(InvoiceNavigateType.FROM_PRODUCT.toString());
        });
        this.productService.findByInvoiceId(this.selectedInvoice!.id).subscribe(res => {
          this.selectedProducts = res.body || [];
          this.localStorageService.addProductSelected(this.selectedProducts);
          this.localStorageService.addProductSelectedPersist(this.selectedProducts);
        });
      }
    }
  }
  modifyServiceInvoiceByChild(modifyItem: ModifyServiceItem) {
    const serviceInvoice = modifyItem.serviceInvoice;
    const item: any = {} as Item;

    item.psId = serviceInvoice?.myServiceId;
    item.invoiceId = this.selectedInvoice!.id;

    if (modifyItem.action) {
      this.initAddService(modifyItem, item);
      this.childInvoiceRightFrame.addService(item, modifyItem.selectedMyServiceFees, modifyItem.feeTypes);
    } else {
      this.childInvoiceRightFrame.removeItem(item);
    }
  }

  modifyProductInvoiceByChild(modifyItem: ModifyProductItem) {
    const productInvoice = modifyItem.productInvoice;
    const item: any = {} as Item;

    item.psId = productInvoice?.myProductId;
    item.invoiceId = this.selectedInvoice!.id;

    if (modifyItem.action) {
      this.initAddProduct(modifyItem, item);
      this.childInvoiceRightFrame.addProduct(item, modifyItem.selectedProductFees, modifyItem.feeTypes);
    } else {
      this.childInvoiceRightFrame.removeItem(item);
    }
  }

  initAddService(modifyItem: ModifyServiceItem, item: Item) {
    const selectedMyServiceFee = modifyItem.selectedMyServiceFees?.find(p => p.myServiceId === item.psId);

    const feeTypeId: any = selectedMyServiceFee!.feeTypeId;
    const paymentAmount: any = selectedMyServiceFee?.fee;

    item.psFeeTypeId = feeTypeId;
    item.type = 'S';
    item.quantity = modifyItem.quantity;
    item.name = modifyItem.name;
    item.paymentAmount = paymentAmount;
  }

  initAddProduct(modifyItem: ModifyProductItem, item: Item) {
    const selectedProductFee: any = modifyItem.selectedProductFees?.find(p => p.myProductId === item.psId);
    item.psFeeTypeId = selectedProductFee!.feeTypeId;
    item.type = 'P';
    item.quantity = modifyItem.quantity;
    item.name = modifyItem.name;
    item.paymentAmount = selectedProductFee?.fee;
  }
  removeFromInvoiceByChild(item: Item) {
    if (item && item.psId) {
      // TODO to check when the page is loaded or not for each Type (Click button)
      if (item.type === 'S') {
        // this.childInvoiceAddService.removeServiceLine(item.psId);
        let displayServiceInvoices = this.localStorageService.getServiceInInvoice();
        displayServiceInvoices = displayServiceInvoices?.filter(i => i.myServiceId !== item.psId);
        this.localStorageService.addServiceInInvoice(displayServiceInvoices);

        const selectedServices: MyService[] = this.localStorageService.getMyServiceSelected();

        const filteredProducts: any = selectedServices.filter(p => p.id !== item.psId);
        this.localStorageService.addMyServiceSelected(filteredProducts);
      } else {
        let displayProductInvoices = this.localStorageService.getProductInInvoice();
        displayProductInvoices = displayProductInvoices?.filter(i => i.myProductId !== item.psId);
        this.localStorageService.addProductInInvoice(displayProductInvoices);
        // remove/filter exciting one.
        const selectedProducts: Product[] = this.localStorageService.getProductSelected();
        const filteredProducts: Product[] = selectedProducts.filter(p => p.id !== item.psId);
        this.localStorageService.addProductSelected(filteredProducts);
      }
    }
  }
  reload() {
    this.childInvoiceRightFrame.refreshItem();
  }

  isTherapySelected() {
    return this.isTherapy;
  }

  changeTherapyOrProduct() {
    this.isTherapy = !this.isTherapy;
    this.startup();
  }

  changeInvoiceOrPaymentPage(paymentInvoice: PaymentInvoice) {
    this.paymentInvoice = paymentInvoice;
    this.invoicePage = InvoicePageType.PAYMENT;
  }
  previousState(): void {
    if (this.invoicePage === InvoicePageType.PAYMENT) {
      this.invoicePage = InvoicePageType.INVOICE;
      this.childInvoiceRightFrame.dirty = false;
    } else if (this.invoicePage === InvoicePageType.INVOICE) {
      this.invoicePage = InvoicePageType.INVOICE_LIST;
      this.childInvoiceRightFrame.dirty = false;
    } else {
      window.history.back();
    }
  }
  goToInvoicePage(): void {
    this.invoicePage = InvoicePageType.INVOICE;
  }
  loadPaymentDetails(paymentInvoice: PaymentInvoice) {
    this.paymentInvoice = paymentInvoice;
    this.invoiceService.find(this.selectedInvoice!.id).subscribe(resp => {
      if (resp) {
        this.selectedInvoice = resp.body!;
      }
    });
    this.childInvoiceAddPayment.initPaymentDetails();
  }

  grandTotal() {
    const taxTotal = this.selectedInvoice ? this.selectedInvoice.taxTotal! : 0.0;
    const subTotal = this.selectedInvoice ? this.selectedInvoice.subTotal! : 0.0;

    return taxTotal + subTotal;
  }

  getDueNow() {
    if (this.paymentInvoice && this.paymentInvoice.dueNow) {
      this.dueNow = this.paymentInvoice.dueNow;
    } else {
      this.dueNow = 0.0;
    }

    return this.dueNow;
  }
  updateInvoiceItems(invoiceItems: Item[]) {
    this.invoiceItems = invoiceItems;
  }

  updateMyServiceFees(myServiceFees: MyServiceFee[]) {
    this.myServiceFees = myServiceFees;
  }

  updateMyProductFees(myProductFees: MyProductFee[]) {
    this.myProductFees = myProductFees;
  }

  updateFeeTypes(feeTypes: FeeType[]) {
    this.feeTypes = feeTypes;
  }
  getFullName() {
    if (this.client) {
      return this.client.firstName + ' ' + this.client.lastName;
    } else {
      return '';
    }
  }
  confirmDeleteInvoice() {
    this.invoicePage = InvoicePageType.INVOICE_LIST;
    this.loadPage(this.page);
  }

  protected readonly focus = focus;
}
