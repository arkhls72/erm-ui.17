import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router, RouterLink } from '@angular/router';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { MyService } from 'app/entities/my-service/my-service.model';

import { FeeType } from 'app/entities/fee-type/fee-type.model';
import { CommonServiceCode } from 'app/entities/common-service-code/common-service-code.model';
import { Invoice } from 'app/entities/invoice/invoice.model';
import { ServiceInvoice } from 'app/entities/service-invoice/service-invoice.model';
import { LocalStorageService } from 'app/entities/local-share/cache/local-storage.service';
import { MyServiceDetail } from 'app/entities/my-service/my-service-detail.model';
import { MyServiceFee } from 'app/entities/my-service-fee/my-service-fee.model';
import { REGULAR_FEE_TYPE_ID } from 'app/entities/local-share/constant/InvoiceConstant';
import { Item } from 'app/entities/invoice/item.model';
import { Product } from 'app/entities/product/product.model';
import { ProductInvoice } from 'app/entities/product-invoice/product-invoice.model';
import { ModifyServiceItem } from '../../invocie-item/modifyServiceItem.model';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { MyServiceService } from '../../my-service/service/my-service.service';
import { ServiceInvoiceService } from '../../service-invoice/service/service-invoice.service';
import { CommonServiceCodeService } from '../../common-service-code/service/common-service-code.service';
import { FeeTypeService } from '../../fee-type/service/fee-type.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../shared/date';
import { SortByDirective, SortDirective } from '../../../shared/sort';
import SharedModule from '../../../shared/shared.module';
import ItemCountComponent from '../../../shared/pagination/item-count.component';

@Component({
  standalone: true,
  selector: 'bc-invoice-add-service',
  templateUrl: './invoice-add-service.component.html',
  imports: [
    FormsModule,
    TranslateModule,
    FaIconComponent,
    RouterLink,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
    NgbPagination,
    ItemCountComponent,
  ],
})
export class InvoiceAddServiceComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @Input()
  invoice?: Invoice;

  @Input()
  // it uses for check/uncheck. It is input and coming from parents
  displayServiceInvoices?: ServiceInvoice[] = [];

  @Output()
  modifyEventEmitter = new EventEmitter<ModifyServiceItem>();

  @Output()
  reloadEventEmitter = new EventEmitter();

  myServices?: MyService[];
  lineCheckedMyServices?: MyService[];
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
  myServiceFees?: MyServiceFee[];
  checkedButton = false;

  constructor(
    protected myServiceService: MyServiceService,
    protected serviceInvoiceService: ServiceInvoiceService,
    protected commonServiceCodeService: CommonServiceCodeService,
    protected feeTypeService: FeeTypeService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected localStorageService: LocalStorageService,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.myServiceNavigation();
  }

  protected startup() {
    let myServiceCache: MyService[] | null = [];
    this.myServiceService.findByInvoiceId(this.invoice?.id).subscribe(res => {
      myServiceCache = res.body;
      this.localStorageService.addMyServiceSelected(myServiceCache!);
    });
    this.myServiceNavigation();
  }
  myServiceNavigation() {
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
        this.getMyServices(pageNumber);
      }
    }).subscribe();
  }

  // this is called at startup
  getMyServices(page?: number) {
    if (this.currentSearch) {
      this.getSearchMyServiceDetail(page);
    } else {
      this.getMyServiceDetail(page);
    }
  }

  getMyServicesCheckedUnChecked(page?: number) {
    const pageToLoad: number = page || this.page || 1;
    if (this.currentSearch) {
      this.getSearchMyServiceDetail(page);
    } else {
      this.myServiceService
        .queryDetail({
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe(
          (res: HttpResponse<MyServiceDetail>) => this.onSuccess(res.body!, res.headers, pageToLoad),
          () => this.onError(),
        );
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackId(index: number, item: MyService) {
    return item.id!;
  }

  sort() {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: MyServiceDetail, headers: HttpHeaders, page: number) {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    const x = data?.myServices;
    this.myServices = [];
    x?.forEach(p => {
      this.myServices?.push(p);
    });
    this.ngbPaginationPage = this.page;
    this.feeTypes = data?.feeTypes;
    this.myServiceFees = data?.myServiceFees;
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
    this.getMyServices();
  }

  clear() {
    this.clearSearchAndCheckUnCheckBox();
    this.getMyServices();
  }

  isSelected(myService: MyService) {
    const serviceInvoiceCache: ServiceInvoice[] = this.localStorageService.getServiceInInvoice()
      ? this.localStorageService.getServiceInInvoice()
      : [];

    const found: ServiceInvoice | undefined = serviceInvoiceCache.find(p => myService.id === p.myServiceId);
    if (found) {
      return true;
    }
    return false;
  }
  // ***************************************************************************************************************
  // *********************************************  Add/Remove Service *********************************************
  // ***************************************************************************************************************

  removeServiceLine(myServiceId: number) {
    const selectedMyServices: MyService[] = this.localStorageService.getMyServiceSelected();
    this.displayServiceInvoices = this.localStorageService.getServiceInInvoice();
    // const foundMyService = myServiceCache.find(p => p.id === myServiceId);
    this.displayServiceInvoices = this.displayServiceInvoices?.filter(i => i.myServiceId !== myServiceId);
    this.localStorageService.addServiceInInvoice(this.displayServiceInvoices);
    // remove/filter exciting one.
    const filteredMyServices: MyService[] = selectedMyServices.filter(p => p.id !== myServiceId);
    this.localStorageService.addMyServiceSelected(filteredMyServices);
  }

  addRemoveService(myService: MyService, event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    const lineChecked = target.checked;

    const modify: ModifyServiceItem = new ModifyServiceItem();
    const disable = this.invoice?.status === 'Paid' || this.invoice?.status === 'In progress';
    if (!disable) {
      let result = false;
      if (!this.checkedButton) {
        result = this.addRemoveWhenCheckUnCheckboxFalse(modify, myService, lineChecked, index);
      } else {
        result = this.addRemoveWhenCheckboxTrue(modify, myService, lineChecked, index);
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
  addRemoveWhenCheckUnCheckboxFalse(modify: ModifyServiceItem, myService: MyService, lineChecked: boolean, index: number): boolean {
    this.displayServiceInvoices = this.localStorageService.getServiceInInvoice();
    if (!lineChecked) {
      if (this.myServices![index].emptyPrice) {
        this.myServices![index].emptyPrice = false;

        return false;
      } else {
        const deleteService = {} as ServiceInvoice;
        deleteService.myServiceId = myService.id;
        modify.action = false;
        modify.serviceInvoice = deleteService;

        this.lineCheckedMyServices = this.localStorageService.getMyServiceSelected();
        this.lineCheckedMyServices = this.lineCheckedMyServices?.filter(p => p.id !== myService.id);
        this.localStorageService.addMyServiceSelected(this.lineCheckedMyServices);

        // remove it from cache
        this.displayServiceInvoices = this.displayServiceInvoices?.filter(i => i.myServiceId !== myService.id);
        this.localStorageService.addServiceInInvoice(this.displayServiceInvoices);
        return true;
      }
    }
    return this.addElement(modify, myService, index);
  }

  // when checkUnCheck checkbox is true
  addRemoveWhenCheckboxTrue(modify: ModifyServiceItem, myService: MyService, lineChecked: boolean, index: number): boolean {
    const selectedMyService = this.lineCheckedMyServices?.find(p => p.id === myService.id);
    // const elementIndex: number= this.findIndex(myService);
    if (!lineChecked) {
      if (index && this.lineCheckedMyServices![index].emptyPrice) {
        this.lineCheckedMyServices![index].emptyPrice = false;
        return false;
      }

      const serviceInvoice = {} as ServiceInvoice;
      // added serviceInvoice
      serviceInvoice.myServiceId = myService.id;
      serviceInvoice.invoiceId = this.invoice!.id;
      modify.serviceInvoice = serviceInvoice;
      modify.action = false;

      this.lineCheckedMyServices = this.lineCheckedMyServices?.filter(p => p.id !== selectedMyService!.id);
      this.localStorageService.addMyServiceSelected(this.lineCheckedMyServices!);

      this.displayServiceInvoices = this.displayServiceInvoices?.filter(i => i.myServiceId !== myService.id);
      this.localStorageService.addServiceInInvoice(this.displayServiceInvoices);

      return true;
    }

    return false;
  }

  addElement(modify: ModifyServiceItem, myService: MyService, index: number): boolean {
    const addedServiceFees: MyServiceFee[] = [];
    let myServiceCache: MyService[] = this.localStorageService.getMyServiceSelected();

    // find fees for passing services
    let selectedRegularServiceFee: MyServiceFee;
    this.myServiceFees?.forEach(p => {
      if (myService.id === p.myServiceId) {
        addedServiceFees.push(p);
        // regular price
        if (p.feeTypeId === REGULAR_FEE_TYPE_ID) {
          selectedRegularServiceFee = p;
        }
      }
    });

    if ((this.myServices && addedServiceFees.length === 0) || this.initTotalPrice(addedServiceFees) === 0) {
      if (this.myServices) {
        this.myServices[index].emptyPrice = true;
      }
      return false;
    }
    const newSvc = {} as ServiceInvoice;
    // added serviceInvoice
    newSvc.myServiceId = myService.id;
    newSvc.invoiceId = this.invoice!.id;
    newSvc.myServiceFeeId = selectedRegularServiceFee!.id;
    newSvc.quantity = 1;
    const persistItemInvoices: Item[] = this.localStorageService.getItemInvoicePersist();
    const serviceItemInvoices: Item[] = persistItemInvoices.filter(p => p.type !== 'P');
    if (serviceItemInvoices && serviceItemInvoices.length > 0) {
      const found: any = persistItemInvoices.find(p => p.psId === myService.id);
      if (found) {
        newSvc.id = found.itemId;
      }
    }

    modify.serviceInvoice = newSvc;
    const name: any = myService.name;
    modify.name = name;

    modify.quantity = 1;

    modify.selectedMyServiceFees = addedServiceFees;
    modify.feeTypes = this.feeTypes;

    modify.action = true;
    this.displayServiceInvoices?.push(newSvc);
    this.localStorageService.addServiceInInvoice(this.displayServiceInvoices);
    if (!myServiceCache || myServiceCache.length === 0) {
      myServiceCache = [];
      myServiceCache.push(myService);
      this.localStorageService.addMyServiceSelected(myServiceCache);
    } else {
      const foundMyService = myServiceCache.find(p => p.id === myService.id);
      if (!foundMyService) {
        myServiceCache.push(myService);
        this.localStorageService.addMyServiceSelected(myServiceCache);
      }
    }

    return true;
  }

  protected onSaveOrDeleteError(err: any, event: any) {
    const target = event.target || event.srcElement || event.currentTarget;
    const idAttr = target.attributes.id;
    const value = idAttr.nodeValue;
    const x = document.getElementById(value) as HTMLInputElement;
    x.checked = false;
  }

  initTotalPrice(foundMyFees: MyServiceFee[]): number {
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

  getSearchMyServiceDetail(page?: number) {
    const pageToLoad: number = page || this.page || 1;
    this.myServiceService
      .searchDetail({
        query: this.currentSearch,
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<MyServiceDetail>) => this.onSuccess(res.body!, res.headers, pageToLoad),
        () => this.onError(),
      );
  }
  getMyServiceDetail(page?: number) {
    const pageToLoad: number = page || this.page || 1;
    this.myServiceService
      .queryDetail({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<MyServiceDetail>) => this.onSuccess(res.body!, res.headers, pageToLoad),
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
      if (checkbox && checkbox.checked && this.myServices) {
        const myService: MyService = this.myServices[i];
        if (myService && myService.emptyPrice) {
          myService.emptyPrice = false;
          checkbox.checked = false;
        }
      }
    }

    //* create a new service invoices off the persistent
    const items: Item[] = this.localStorageService.getItemInvoicePersist();
    const serviceItems: Item[] = items.filter(p => p.type !== 'P');
    const resetServiceInvoices: ServiceInvoice[] = [];
    serviceItems.forEach(i => {
      if (i.type === 'S') {
        const reset: ServiceInvoice = {} as ServiceInvoice;
        const resetId: any = i.itemId;
        reset.id = resetId;
        reset.myServiceId = i.psId;
        reset.invoiceId = i.invoiceId;
        reset.myServiceFeeId = i.psFeeId;
        reset.quantity = i.quantity;
        resetServiceInvoices.push(reset);
      }
    });
    // update service In Invoice and selected Service
    this.localStorageService.addServiceInInvoice(resetServiceInvoices);
    this.localStorageService.addMyServiceSelected(this.localStorageService.getMyServiceSelectedPersists());
    this.displayServiceInvoices = resetServiceInvoices;
    // Reset products from ServiceInvoice without calling backend
    this.resetProductFromServiceSide();

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
      this.lineCheckedMyServices = [];
      this.checkedButton = true;
      this.lineCheckedMyServices = this.localStorageService.getMyServiceSelected();
    } else {
      this.checkedButton = false;
      this.lineCheckedMyServices = undefined;
    }
  }
  resetProductFromServiceSide() {
    const productPersists: Product[] = this.localStorageService.getProductSelectedPersist();
    this.localStorageService.addProductSelected(productPersists);

    //* create a new service invoices off the persistent
    const items: Item[] = this.localStorageService.getItemInvoicePersist();
    const resetProductInvoices: ProductInvoice[] = [];
    const productItems = items.filter(p => p.type !== 'S');
    productItems.forEach(i => {
      const reset: ProductInvoice = {} as ProductInvoice;
      const resetId: any = i.itemId;
      if (i.type === 'P') {
        reset.id = resetId;
        reset.myProductId = i.psId;
        reset.invoiceId = i.invoiceId;
        reset.myProductFeeId = i.psFeeId;
        reset.quantity = i.quantity;
        resetProductInvoices.push(reset);
      }
    });
    this.localStorageService.addProductInInvoice(resetProductInvoices);
  }

  changeTherapyOrProduct() {}
}
