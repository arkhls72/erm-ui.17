import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data, RouterLink } from '@angular/router';
import { Subscription, combineLatest, Subject } from 'rxjs';
import { FeeType } from 'app/entities/fee-type/fee-type.model';
import { Invoice } from 'app/entities/invoice/invoice.model';
import { REGULAR_FEE_TYPE_ID } from 'app/entities/local-share/constant/InvoiceConstant';
import { ProductDetail } from 'app/entities/product/product-detail.model';
import { Product } from 'app/entities/product/product.model';
import { ProductInvoice } from 'app/entities/product-invoice/product-invoice.model';
import { MyProductFee } from 'app/entities/my-product-fee/my-product-fee.model';
import { Item } from 'app/entities/invoice/item.model';
import { MyService } from 'app/entities/my-service/my-service.model';
import { ServiceInvoice } from 'app/entities/service-invoice/service-invoice.model';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { ModifyProductItem } from '../../invocie-item/modifyProductItem.model';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { ProductService } from '../../product/service/product.service';
import { ProductInvoiceService } from '../../product-invoice/service/product-invoice.service';
import { FeeTypeService } from '../../fee-type/service/fee-type.service';
import { LocalStorageService } from '../../local-share/cache/local-storage.service';
import { FormsModule } from '@angular/forms';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../shared/date';
import { SortByDirective, SortDirective } from '../../../shared/sort';
import SharedModule from '../../../shared/shared.module';
import { NgIf } from '@angular/common';
import ItemCountComponent from '../../../shared/pagination/item-count.component';

@Component({
  standalone: true,
  selector: 'bc-invoice-add-product',
  templateUrl: './invoice-add-product.component.html',
  imports: [
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
    RouterLink,
    NgIf,
    NgbPagination,
    ItemCountComponent,
    ItemCountComponent,
    ItemCountComponent,
    ItemCountComponent,
  ],
})
export class InvoiceAddProductComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  isTherapy?: boolean;
  @Input()
  invoice?: Invoice;

  @Input()
  // it uses for check/uncheck. It is input and coming from parents
  displayProductInvoices?: ProductInvoice[];

  @Output()
  modifyEventEmitter = new EventEmitter<ModifyProductItem>();

  @Output()
  reloadEventEmitter = new EventEmitter();

  products?: Product[];
  lineCheckedProducts?: Product[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  feeTypes?: FeeType[];

  currentSearch!: string;
  myProductFees?: MyProductFee[];
  checkedButton = false;

  constructor(
    protected productService: ProductService,
    protected productInvoiceService: ProductInvoiceService,
    protected feeTypeService: FeeTypeService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected localStorageService: LocalStorageService,
    protected modalService: NgbModal,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.productNavigation();
  }

  protected startup() {
    this.productNavigation();
  }
  productNavigation() {
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
        this.getProducts(pageNumber);
      }
    }).subscribe();
  }

  // this is called at startup
  getProducts(page?: number) {
    if (this.currentSearch) {
      this.getSearchProductDetail(page);
    } else {
      this.getProdcutDetail(page);
    }
  }

  getMyProductsCheckedUnChecked(page?: number) {
    const pageToLoad: number = page || this.page || 1;
    if (this.currentSearch) {
      this.getSearchProductDetail(page);
    } else {
      this.productService
        .queryDetail({
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe(
          (res: HttpResponse<ProductDetail>) => this.onSuccess(res.body!, res.headers, pageToLoad),
          () => this.onError(),
        );
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackId(index: number, item: Product) {
    return item.id!;
  }

  sort() {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: ProductDetail, headers: HttpHeaders, page: number) {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    const x = data?.products;
    this.products = [];
    x?.forEach(p => {
      this.products?.push(p);
    });
    this.ngbPaginationPage = this.page;
    this.feeTypes = data?.feeTypes;
    this.myProductFees = data?.myProductFees;
  }
  protected onError() {
    this.ngbPaginationPage = this.page ?? 1;
  }

  search(query: string) {
    this.checkedButton = false;
    const x = document.getElementById('checkUncheck') as HTMLInputElement;
    if (x) {
      x.checked = false;
    }

    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.getProducts();
  }

  clear() {
    this.clearSearchAndCheckUnCheckBox();
    this.getProducts();
  }

  isSelected(product: Product) {
    const productInvoiceCache: ProductInvoice[] = this.localStorageService.getProductInInvoice()
      ? this.localStorageService.getProductInInvoice()
      : [];

    const found: ProductInvoice | undefined = productInvoiceCache.find(p => product.id === p.myProductId);
    if (found) {
      return true;
    }
    return false;
  }

  // ***************************************************************************************************************
  // *********************************************  Add/Remove PRODUCT *********************************************
  // ***************************************************************************************************************
  removeProductLine(productId: number) {
    const selectedProducts: Product[] = this.localStorageService.getProductSelected();
    this.displayProductInvoices = this.localStorageService.getProductInInvoice();
    this.displayProductInvoices = this.displayProductInvoices?.filter(i => i.myProductId !== productId);
    this.localStorageService.addProductInInvoice(this.displayProductInvoices);
    // remove/filter exciting one.
    const filteredProducts: Product[] = selectedProducts.filter(p => p.id !== productId);
    this.localStorageService.addProductSelected(filteredProducts);
  }

  addRemoveProduct(product: Product, event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    const lineChecked = target.checked;

    const disable = this.invoice?.status === 'Paid' || this.invoice?.status === 'In progress';
    if (!disable) {
      const modify: ModifyProductItem = new ModifyProductItem();
      let result = false;
      if (!this.checkedButton) {
        result = this.addRemoveWhenCheckUnCheckboxFalse(modify, product, lineChecked, index);
      } else {
        result = this.addRemoveWhenCheckboxTrue(modify, product, lineChecked, index);
      }
      if (result) {
        this.modifyEventEmitter.emit(modify);
      }
    } else {
      const checkbox = document.getElementById('line-checkbox-' + index) as HTMLInputElement;
      checkbox.checked = !lineChecked;
    }
  }

  // when checkUnCheck checkbox is false
  addRemoveWhenCheckUnCheckboxFalse(modify: ModifyProductItem, product: Product, lineChecked: boolean, index: number): boolean {
    this.displayProductInvoices = this.localStorageService.getProductInInvoice();

    if (!lineChecked) {
      if (index && this.products && this.products![index].emptyPrice) {
        this.products[index]!.emptyPrice = false;

        return false;
      } else {
        const productInviceDelete = {} as ProductInvoice;
        productInviceDelete.myProductId = product.id;
        modify.action = false;
        modify.productInvoice = productInviceDelete;

        this.lineCheckedProducts = this.localStorageService.getProductSelected();
        this.lineCheckedProducts = this.lineCheckedProducts?.filter(p => p.id !== product.id);
        this.localStorageService.addProductSelected(this.lineCheckedProducts);

        // remove it from cache
        this.displayProductInvoices = this.displayProductInvoices?.filter(i => i.myProductId !== product.id);
        this.localStorageService.addProductInInvoice(this.displayProductInvoices);

        return true;
      }
    }
    return this.addElement(modify, product, index);
  }

  // when checkUnCheck checkbox is true
  addRemoveWhenCheckboxTrue(modify: ModifyProductItem, product: Product, lineChecked: boolean, index: number): boolean {
    const selectedProduct = this.lineCheckedProducts?.find(p => p.id === product.id);
    // const elementIndex: number= this.findIndex(myService);
    if (!lineChecked) {
      if (index && this.lineCheckedProducts![index].emptyPrice) {
        this.lineCheckedProducts![index].emptyPrice = false;
        return false;
      }

      const productInvoice = {} as ProductInvoice;
      // added serviceInvoice
      productInvoice.myProductId = product.id;
      productInvoice.invoiceId = this.invoice!.id;
      modify.productInvoice = productInvoice;
      modify.action = false;

      this.lineCheckedProducts = this.lineCheckedProducts?.filter(p => p.id !== selectedProduct!.id);
      this.localStorageService.addProductSelected(this.lineCheckedProducts);

      this.displayProductInvoices = this.displayProductInvoices?.filter(i => i.myProductId !== product.id);
      this.localStorageService.addProductInInvoice(this.displayProductInvoices);

      return true;
    }

    return false;
  }

  addElement(modify: ModifyProductItem, product: Product, index: number): boolean {
    const addedProductFees: MyProductFee[] = [];
    let selectedProducts: Product[] = this.localStorageService.getProductSelected();

    // find fees for passing services
    let selectedRegularProductFee: MyProductFee;
    this.myProductFees?.forEach(p => {
      if (product.id === p.myProductId) {
        addedProductFees.push(p);
        // regular price
        if (p.feeTypeId === REGULAR_FEE_TYPE_ID) {
          selectedRegularProductFee = p;
        }
      }
    });

    if ((this.products && addedProductFees.length === 0) || this.initTotalPrice(addedProductFees) === 0) {
      this.products![index].emptyPrice = true;
      return false;
    }
    const productInvoice: ProductInvoice = {} as ProductInvoice;
    // added serviceInvoice
    productInvoice.myProductId = product.id;
    productInvoice.invoiceId = this.invoice!.id;
    productInvoice.myProductFeeId = selectedRegularProductFee!.id;
    productInvoice.quantity = 1;

    const persistItemInvoices: Item[] = this.localStorageService.getItemInvoicePersist();
    const productItems: Item[] = this.localStorageService.getItemInvoicePersist() ? persistItemInvoices.filter(p => p.type !== 'S') : [];

    const found: Item | undefined = productItems.find(p => p.psId === product.id);
    if (found && productInvoice) {
      const id: any = found.itemId;
      productInvoice.id = id;
    }
    const copy: any = modify;
    copy.productInvoice = productInvoice;
    copy.name = product.name;
    copy.quantity = 1;

    copy.selectedProductFees = addedProductFees;
    copy.feeTypes = this.feeTypes;

    copy.action = true;
    this.displayProductInvoices?.push(productInvoice);
    this.localStorageService.addProductInInvoice(this.displayProductInvoices);
    if (!selectedProducts || selectedProducts.length === 0) {
      selectedProducts = [];
      selectedProducts.push(product);
    } else {
      const foundProduct = selectedProducts.find(p => p.id === product.id);
      if (!foundProduct) {
        selectedProducts.push(product);
      }
    }
    this.localStorageService.addProductSelected(selectedProducts);
    return true;
  }

  protected onSaveOrDeleteError(err: any, event: any) {
    const target = event.target || event.srcElement || event.currentTarget;
    const idAttr = target.attributes.id;
    const value = idAttr.nodeValue;
    const x = document.getElementById(value) as HTMLInputElement;
    x.checked = false;
  }

  initTotalPrice(foundMyFees: MyProductFee[]): number {
    const myServiceFees = foundMyFees;
    if (!myServiceFees) {
      return 0;
    }
    for (let i = 0; i < myServiceFees.length; i++) {
      const fee = myServiceFees[i]!.fee ? myServiceFees[i]!.fee : 0;
      if (fee && fee > 0) {
        i = myServiceFees.length;
        return 1;
      }
    }
    return 0;
  }

  getSearchProductDetail(page?: number) {
    const pageToLoad: number = page || this.page || 1;
    this.productService
      .searchDetail({
        query: this.currentSearch,
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ProductDetail>) => this.onSuccess(res.body!, res.headers, pageToLoad),
        () => this.onError(),
      );
  }
  getProdcutDetail(page?: number) {
    const pageToLoad: number = page || this.page || 1;
    this.productService
      .queryDetail({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ProductDetail>) => this.onSuccess(res.body!, res.headers, pageToLoad),
        () => this.onError(),
      );
  }
  resetRefresh() {
    const page = this.page;
    const totalItems = this.totalItems;

    const syntheticEvent = new CustomEvent('change', {
      detail: {
        checked: false,
      },
    });
    this.checkUnCheck(syntheticEvent);
    for (let i = 0; i < ITEMS_PER_PAGE; i++) {
      const checkbox = document.getElementById('line-checkbox-' + i) as HTMLInputElement;
      if (checkbox && checkbox.checked && this.products) {
        const pr: Product = this.products[i];
        if (pr && pr.emptyPrice) {
          pr.emptyPrice = false;
          checkbox.checked = false;
        }
      }
    }
    //* create a new service invoices off the persistent
    const items: Item[] = this.localStorageService.getItemInvoicePersist();
    const resetProductInvoices: ProductInvoice[] = [];
    const productItems = items.filter(p => p.type !== 'S');
    productItems.forEach(i => {
      const reset: ProductInvoice = {} as ProductInvoice;
      if (i.type === 'P' && i.itemId && i.itemId !== null) {
        reset.id = i.itemId;
        reset.myProductId = i.psId;
        reset.invoiceId = i.invoiceId;
        reset.myProductFeeId = i.psFeeId;
        reset.quantity = i.quantity;
        resetProductInvoices.push(reset);
      }
    });
    // update service In Invoice
    this.localStorageService.addProductInInvoice(resetProductInvoices);
    this.displayProductInvoices = resetProductInvoices;
    this.localStorageService.addProductSelected(this.localStorageService.getProductSelectedPersist());
    this.resetServiceFromProduct();
    let clearMode = false;
    if (this.currentSearch) {
      clearMode = true;
      this.clear();
    } else {
      this.clearSearchAndCheckUnCheckBox();
    }
    this.reloadEventEmitter.emit(true);
    if (!clearMode) {
      this.page = page;
      this.totalItems = totalItems;
      this.itemsPerPage = ITEMS_PER_PAGE;
    }
  }
  clearSearchAndCheckUnCheckBox() {
    this.checkedButton = false;
    const x = document.getElementById('checkUncheck') as HTMLInputElement;
    if (x) {
      x.checked = false;
    }
    this.page = 0;
    this.currentSearch = '';
  }
  checkUnCheck(event: Event) {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    if (checked) {
      this.lineCheckedProducts = [];
      this.checkedButton = true;
      this.lineCheckedProducts = this.localStorageService.getProductSelected();
    } else {
      this.checkedButton = false;
      this.lineCheckedProducts = undefined;
    }
  }

  resetServiceFromProduct() {
    const myServicePersists: MyService[] = this.localStorageService.getMyServiceSelectedPersists();
    this.localStorageService.addMyServiceSelected(myServicePersists);

    //* create a new service invoices off the persistent
    const items: Item[] = this.localStorageService.getItemInvoicePersist();
    const serviceItems: Item[] = items.filter(p => p.type !== 'P');
    const resetServiceInvoices: ServiceInvoice[] = [];
    serviceItems.forEach(i => {
      if (i.type === 'S') {
        const reset: any = {} as ServiceInvoice;
        reset.id = i.itemId;
        reset.myServiceId = i.psId;
        reset.invoiceId = i.invoiceId;
        reset.myServiceFeeId = i.psFeeId;
        reset.quantity = i.quantity;
        resetServiceInvoices.push(reset);
      }
    });
    // update service In Invoice

    this.localStorageService.addServiceInInvoice(resetServiceInvoices);
  }
}
