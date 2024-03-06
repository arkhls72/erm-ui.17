import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'app/entities/order/order.model';
import { ProductOrder } from 'app/entities/product-order/product-order.model';
import { Supplier } from 'app/entities/supplier/supplier.model';
import { Product } from 'app/entities/product/product.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderEventType } from 'app/entities/local-share/orderEvent';
import { OrderService } from '../service/order.service';
import { ProductService } from '../../product/service/product.service';
import { ProductOrderService } from '../../product-order/service/product-order.service';
import { SupplierService } from '../../supplier/service/supplier.service';
import { ProductOrderUpdate } from '../../product-order/product-order-update.model';

@Component({
  selector: 'bc-product-order-table',
  templateUrl: './order-product-table.component.html',
})
export class OrderProductTableComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @Output()
  eventEmitter = new EventEmitter<OrderEventType>();

  @Output()
  orderEmitter = new EventEmitter<Order>();

  @Output()
  orderProductEmitter = new EventEmitter<ProductOrder[]>();

  @Input()
  order!: Order;
  selectedIndex?: number;

  productOrders!: ProductOrder[];
  @Input()
  suppliers?: Supplier[];

  @Input()
  products?: Product[];

  statuses!: String[];

  selectedProductOrder?: ProductOrder;
  eventSubscriber?: Subscription;

  constructor(
    protected orderService: OrderService,
    protected activatedRoute: ActivatedRoute,
    protected productService: ProductService,
    protected productOrderService: ProductOrderService,
    protected supplierService: SupplierService,
    protected router: Router,
    protected modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.initProductOrderStatuses();
    this.loadProductOrders();
  }

  loadProductOrders() {
    this.productOrderService.findByOrderNumber(this.order.id).subscribe(res => {
      const productOrder: any = res.body;
      this.productOrders = productOrder;
    });
  }

  deleteRow(i: number) {
    this.selectedProductOrder = this.productOrders[i];
    if (this.selectedProductOrder !== undefined && this.selectedProductOrder !== null) {
      const productOrderId: any = this.selectedProductOrder.id;
      this.deleteProductOrder(productOrderId, i);
    }
    return false;
  }

  deleteProductOrder(id: number, i: number) {
    const orderId: any = this.order.id;
    this.productOrderService.delete(id).subscribe(() => {
      this.productOrders.splice(i, 1);
      this.refreshOrder(orderId);
      this.loadProductOrders();
      if (this.productOrders === undefined || this.productOrders === null || this.productOrders.length === 0) {
        this.eventEmitter.emit(OrderEventType.PRODUCT_ADD);
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initSupplierName(id: any) {
    const foundItem: any = this.suppliers!.find(p => p.id === id);
    if (foundItem !== null && foundItem !== undefined) {
      return foundItem.name;
    }
    return '';
  }

  initSupplierNameByProduct(id: any) {
    if (this.products === undefined || this.products === null) {
      return '';
    }
    const foundProduct: any = this.products.find(p => p.id === id);
    if (foundProduct === undefined || foundProduct === null) {
      return '';
    }

    return this.initSupplierName(foundProduct.supplierId);
  }

  initItemPrice(id: any) {
    if (this.products === undefined || this.products === null) {
      return '';
    }
    const foundProduct: any = this.products.find(p => p.id === id);
    if (foundProduct === undefined || foundProduct === null) {
      return '';
    }
    return foundProduct.itemPrice;
  }

  initProductName(id: any) {
    if (this.products === undefined || this.products === null) {
      return '';
    }
    const foundProduct: any = this.products.find(p => p.id === id);
    if (foundProduct === undefined || foundProduct === null) {
      return '';
    }

    return foundProduct.name;
  }

  protected subscribeToSaveResponseList(result: Observable<HttpResponse<ProductOrder[]>>): void {
    result.subscribe(res => this.onSaveSuccessList(res.body!));
  }
  onSaveSuccessList(res: ProductOrder[]) {
    const productOrders: any = res;
    this.productOrders = productOrders;
    // update Parent productOrder
    this.orderProductEmitter.emit(this.productOrders);
    if (this.productOrders === undefined || this.productOrders.length === 0) {
      this.eventEmitter.emit(OrderEventType.PRODUCT_ADD);
    } else {
      const id: any = this.order.id;
      this.refreshOrder(id);
    }
  }

  changeStatus(productOrder: ProductOrder, event: Event) {
    const status = this.findElementStringValue(event);
    productOrder.status = status;
    for (let i = 0; i < this.productOrders.length; i++) {
      if (this.productOrders[i].id === productOrder.id) {
        this.productOrders[i].status = status;
      }
    }
  }
  private findElementStringValue(e: Event) {
    return (e.target as HTMLInputElement).value;
  }

  initProductOrderStatuses() {
    this.statuses = [];
    this.statuses.push('Draft');
    this.statuses.push('Submitted');
    this.statuses.push('Delivered');
    this.statuses.push('Shipped');
    this.statuses.push('Cancelled');
    this.statuses.push('Rejected');
  }

  saveForUpdateList() {
    const productOrderUpdate = {} as ProductOrderUpdate;
    productOrderUpdate.orderId = this.order.id;
    productOrderUpdate.productOrders = this.productOrders;
    productOrderUpdate.note = this.order.note;
    this.subscribeToSaveResponseList(this.productOrderService.updateList(productOrderUpdate));
  }

  refreshOrder(id: number) {
    if (id !== undefined && id !== null) {
      this.orderService.find(id).subscribe(resp => {
        const order: any = resp.body;
        this.order = order;
        // update Parent Order
        this.orderEmitter.emit(this.order);
      });
    }
  }
  isProductOrderDisable() {
    if (this.productOrders === undefined || this.productOrders === null || this.productOrders.length === 0) {
      return true;
    }
    return false;
  }

  onCancel(): void {
    this.eventEmitter.emit(OrderEventType.PRODUCT_ADD);
  }
}
