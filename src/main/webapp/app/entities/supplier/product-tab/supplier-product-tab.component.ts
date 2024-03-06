import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { Product } from 'app/entities/product/product.model';
import { SupplierEvent, SupplierEventType } from 'app/entities/local-share/supplier-event';
import { SupplierEventService } from 'app/entities/local-share/supplier-event.service';
import { Supplier } from '../supplier.model';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { ProductService } from '../../product/service/product.service';
import { SupplierService } from '../service/supplier.service';

@Component({
  selector: 'bc-supplier-product-tab',
  templateUrl: './supplier-product-tab.component.html',
})
export class SupplierProductTabComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @Input()
  supplier!: Supplier;
  products: Product[] = [];
  suppliers: Supplier[] = [];
  product!: Product;
  eventSubscriber!: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  previousPage: any;
  reverse: any;
  ngbPaginationPage = 1;
  supplierEventType = SupplierEventType.PRODUCT_LIST;
  eventSubscription!: Subscription;
  currentSearch!: string;

  constructor(
    protected productService: ProductService,
    protected supplierService: SupplierService,
    protected supplierEventService: SupplierEventService,
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 1;
    this.previousPage = 1;
    this.reverse = true;
    this.predicate = 'id';
  }

  ngOnInit(): void {
    this.eventSubscription = this.supplierEventService.subscribe(this.onSupplierEvent.bind(this));
    this.initSupplier();
    this.loadPage(this.page);
  }

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page || 1;
    switch (this.supplierEventType) {
      case SupplierEventType.PRODUCT_LIST:
        if (this.currentSearch) {
          this.productService
            .searchBySupplier(
              {
                query: this.currentSearch,
                page: pageToLoad - 1,
                size: this.itemsPerPage,
                sort: this.sort(),
              },
              this.supplier.id,
            )
            .subscribe(
              (res: HttpResponse<Product[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
              () => this.onError(),
            );
        } else {
          this.productService
            .findBySupplierId(
              {
                page: pageToLoad - 1,
                size: this.itemsPerPage,
                sort: this.sort(),
              },
              this.supplier.id,
            )
            .subscribe(
              (res: HttpResponse<Product[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
              () => this.onError(),
            );
        }

        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackId(index: number, item: Product): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: Product[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.products = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  initSupplier() {
    this.supplierService.queryAll().subscribe(res => {
      const x: any = res.body;
      this.suppliers = x;
    });
  }

  initSupplierName(id: any) {
    const suppliers: any = this.suppliers;
    const foundItem: any = suppliers.find((p: { id: any }) => p.id === id);
    if (foundItem !== null && foundItem !== undefined) {
      return foundItem.name;
    }
    return '';
  }

  deleteSupplierProduct(id: any) {
    this.supplierEventType = SupplierEventType.PRODUCT_DELETE;
    const foundProdcut: any = this.products.find(p => p.id === id);
    this.product = foundProdcut;
  }
  addProductToSupplier() {
    // this.router.navigate(['/product/' + this.supplier.id + '/new']);
    this.supplierEventType = SupplierEventType.PRODUCT_ADD;
  }
  backToProductList() {
    this.supplierEventType = SupplierEventType.PRODUCT_LIST;
    this.loadPage(this.page);
  }

  backToProductGeneral() {
    this.supplierEventType = SupplierEventType.PRODUCT_EDIT;
    this.loadPage(this.page);
  }

  editMyProduct(product: any) {
    this.product = product;
    this.supplierEventType = SupplierEventType.PRODUCT_EDIT;
    this.loadPage(this.page);
  }

  goToGeneral() {
    this.supplierEventType = SupplierEventType.PRODUCT_EDIT;
    this.loadPage(this.page);
  }

  goToSpecification() {
    this.supplierEventType = SupplierEventType.PRODUCT_SPEC;
    this.loadPage(this.page);
  }

  goToFeePackage() {
    this.supplierEventType = SupplierEventType.PRODUCT_FEE;
    this.loadPage(this.page);
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
    this.loadPage(this.page);
  }
  private onSupplierEvent(evt: SupplierEvent): void {
    if (evt.source && evt.type === SupplierEventType.BACK) {
      this.supplierEventType = SupplierEventType.PRODUCT_LIST;
      this.loadPage(this.page);
      evt.type = this.supplierEventType;
      return;
    }

    if (evt.source === 'supplier-product-general' && evt.type === SupplierEventType.PRODUCT_EDIT && evt.product) {
      evt.source = undefined;
      this.editMyProduct(evt.product);
      return;
    }
  }
}
