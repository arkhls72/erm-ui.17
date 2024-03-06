import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'app/entities/order/order.model';
import { ProductOrder } from 'app/entities/product-order/product-order.model';
import { Supplier } from 'app/entities/supplier/supplier.model';
import { Product } from 'app/entities/product/product.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderEventType } from 'app/entities/local-share/orderEvent';
import { DatePipe, DOCUMENT } from '@angular/common';
import { OrderService } from './service/order.service';
import { ProductService } from '../product/service/product.service';
import { ProductOrderService } from '../product-order/service/product-order.service';
import { SupplierService } from '../supplier/service/supplier.service';
import { ITEMS_PER_PAGE } from '../../config/pagination.constants';

@Component({
  selector: 'jhi-order-detail',
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  order!: Order;

  orderPageFlow: OrderEventType = OrderEventType.PRODUCT_ADD;

  selectedIndex?: number;

  // List of products that are in order
  productOrders: ProductOrder[] = [];

  // list of Suppliers
  // TODO for better performance should be paginated per list of products displayed on the page
  suppliers?: Supplier[];

  // list of Products that could be in  productOrders list
  products?: Product[];

  // keeps Product Ids that are selected in Product orders
  selectedProductIds: number[] = [];
  // selectedProductOrderIds: number[] = [];
  isSaving = false;

  selectedProductOrder!: ProductOrder | null;
  eventSubscriber?: Subscription;

  totalItems = 0;
  // was 5
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  currentSearch!: string;
  previousPage: any;
  reverse: any;
  eventSubscription!: Subscription;
  // orderEventType: OrderEventType = OrderEventType.PRODUCT_ADD;

  constructor(
    protected orderService: OrderService,
    protected activatedRoute: ActivatedRoute,
    protected productService: ProductService,
    protected productOrderService: ProductOrderService,
    protected supplierService: SupplierService,
    protected router: Router,
    protected modalService: NgbModal,
    private datePipe: DatePipe,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 1;
    this.previousPage = 1;
    this.reverse = true;
    this.predicate = 'id';
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.order = order;
      if (this.order.status !== 'Draft') {
        this.orderPageFlow = OrderEventType.ORDER_PLACEMENT;
      }
      this.searchProduct(1);
      this.loadSummaryProductOrders();
    });
    this.getAllSupplier();
  }

  previousState(): void {
    window.history.back();
  }

  getGrandTotal() {
    const x: number = this.order?.taxTotal === undefined || this.order?.taxTotal === null ? 0.0 : this.order?.taxTotal;
    const y: number = this.order?.subTotal === undefined || this.order?.subTotal === null ? 0.0 : this.order?.subTotal;
    return x + y;
  }

  // ****************************************************    TOP Table  **********************************   //
  searchProduct(page?: number): void {
    const pageToLoad: number = page || this.page || 1;
    if (this.currentSearch) {
      this.productService
        .search({
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
          query: this.currentSearch,
        })
        .subscribe(
          (res: HttpResponse<Product[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
          () => this.onError(),
        );
    } else {
      this.loadProducts(pageToLoad);
    }
  }
  loadProducts(page?: number) {
    const pageToLoad: number = page || this.page || 1;
    this.productService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<Product[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
        () => this.onError(),
      );
  }

  loadSummaryProducts() {
    this.productService
      .findSummaryByIds({
        ids: this.selectedProductIds,
      })
      .subscribe(
        (res: HttpResponse<Product[]>) => this.onSuccessSummary(res.body),
        () => this.onError(),
      );
  }
  // Summary productOrder list id and productId by orderId
  loadSummaryProductOrders(): void {
    if (this.order !== undefined && this.order !== null) {
      // must be changed to summary
      this.productOrderService.findByOrderNumber(this.order.id).subscribe(res => {
        const productOrder: any = res.body;
        this.productOrders = productOrder;
        // this.orderEventType = this.productOrders === undefined || this.productOrders === null  || this.productOrders.length === 0 ? OrderEventType.PRODUCT_ADD:OrderEventType.ORDER_PRODUCT_LIST;
        this.initSelectedProductIds();
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackId(index: number, item: Product): number {
    return item.id!;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }
  // on success for Products list
  protected onSuccess(data: Product[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.products = data || [];
    this.ngbPaginationPage = this.page;
  }
  protected onSuccessSummary(data: Product[] | null): void {
    const x: any = data;
    this.products = x;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  getAllSupplier() {
    this.supplierService.queryAll().subscribe(res => {
      const supplier: any = res.body;
      this.suppliers = supplier;
    });
  }

  initSupplierName(id: any) {
    if (this.suppliers === undefined || this.suppliers === null) {
      return '';
    }
    const foundItem: any = this.suppliers.find(p => p.id === id);
    if (foundItem !== null && foundItem !== undefined) {
      return foundItem.name;
    }
    return '';
  }

  initSupplierNameByProduct(id: any) {
    const foundProduct: any = this.products!.find(p => p.id === id);
    if (foundProduct === undefined || foundProduct === null) {
      return '';
    }

    return this.initSupplierName(foundProduct.supplierId);
  }

  initSelectedProductIds() {
    this.selectedProductIds = [];
    this.productOrders.forEach((p: ProductOrder) => {
      if (p.myProductId !== null && p.myProductId !== undefined) {
        this.selectedProductIds.push(p.myProductId);
      }
    });
  }

  search(query: string) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.searchProduct();
  }

  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.searchProduct();
  }

  isSelected(product: Product): boolean {
    const found: ProductOrder | undefined = this.productOrders?.find(p => product.id === p.myProductId);
    if (found !== undefined && found !== null && found.id != null) {
      return true;
    }
    return false;
  }

  addOrRemoveProduct(product: Product, event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      const newProduct = {} as ProductOrder;
      newProduct.myProductId = product.id;
      newProduct.orderPrice = product.itemPrice;
      newProduct.quantity = 1;

      if (this.order !== undefined && this.order !== null) {
        newProduct.orderId = this.order.id;
      }
      this.subscribeToSaveResponse(this.productOrderService.create(newProduct));
    } else {
      const found: ProductOrder | undefined = this.productOrders.find(p => p.myProductId === product.id);

      if (found !== undefined && found !== null) {
        const deletedId: number | undefined = found.id;
        this.productOrderService.delete(deletedId).subscribe(() => {
          this.productOrders = this.productOrders.filter(i => i.id !== deletedId);
          this.selectedProductIds = this.selectedProductIds?.filter(j => j !== found.myProductId);
          this.refreshOrder();
        });
      }
    }
  }
  checkUnCheck(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.checked) {
      this.productService
        .findSummaryByIds({
          ids: this.selectedProductIds,
        })
        .subscribe(res => {
          const products: any = res.body;
          this.products = products;
        });
    } else {
      this.searchProduct(1);
    }

    return target.checked;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProductOrder>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body!));
  }

  protected onSaveSuccess(res: ProductOrder): void {
    this.selectedProductOrder = res;

    if (this.selectedProductOrder && this.selectedProductOrder.id) {
      this.productOrders.push(this.selectedProductOrder);
      if (this.selectedProductOrder.orderId) {
        this.order.id = this.selectedProductOrder.orderId;
      }

      if (this.selectedProductOrder.myProductId !== null) {
        const productId: number | undefined = this.selectedProductOrder.myProductId;
        if (productId != null) {
          this.selectedProductIds.push(productId);
        }
      }
      this.refreshOrder();
    }
  }
  // detail.first arrow
  onProductAddArrow() {
    this.orderPageFlow = OrderEventType.PRODUCT_ADD;
    this.refreshOrder();
    this.searchProduct(1);
  }
  // detail.Second arrow
  onOrderProductArrow() {
    if (this.productOrders.length > 0) {
      this.orderPageFlow = OrderEventType.ORDER_PRODUCT_LIST;
      this.refreshOrder();
      this.loadSummaryProducts();
    }
  }

  // detail.Third arrow
  onPaymentArrow() {
    if (this.productOrders.length > 0) {
      this.orderPageFlow = OrderEventType.ORDER_PAYMENT;
    }
  }

  onOrderPlaceArrow() {
    const orderStatus = this.order.status;
    if (orderStatus !== undefined && orderStatus !== null && orderStatus !== 'Draft') {
      this.orderPageFlow = OrderEventType.ORDER_PLACEMENT;
    }
  }

  //  get Order by order id. Once order is updated then Su
  private refreshOrder() {
    const id: any = this.order.id;
    this.orderService.find(id).subscribe(p => {
      const order: any = p.body;
      this.order = order;
    });
    this.loadSummaryProductOrders();
  }

  public refreshOrderByChild(newOrder: Order): void {
    this.order = newOrder;
  }

  public refreshProductOrderByChild(newProductOrders: ProductOrder[]): void {
    this.productOrders = newProductOrders;
  }

  public refreshByBackButton(orderEventType: OrderEventType): void {
    this.orderPageFlow = orderEventType;
    if (orderEventType === OrderEventType.PRODUCT_ADD) {
      this.searchProduct(1);
      this.refreshOrder();
    }
  }

  uncheckedCheckBox(): void {
    const x: any = document.getElementById('checkUncheck');
    if (x) {
      x.checked = false;
    }
  }
}
