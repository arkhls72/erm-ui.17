import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { OrderPayment } from 'app/entities/order-payment/order-payment.model';
import { Order } from 'app/entities/order/order.model';
import { OrderEventType } from 'app/entities/local-share/orderEvent';
import { OrderPaymentService } from '../../order-payment/service/order-payment.service';
import { Dayjs } from 'dayjs';
import { DATE_TIME_FORMAT } from '../../../config/input.constants';
import { OrderPaymentUpdate } from '../../order-payment/order-payment-update.model';

@Component({
  selector: 'bc-order-payment-table',
  templateUrl: './order-payment-table.component.html',
})
export class OrderPaymentTableComponent implements OnInit {
  @Output()
  eventEmitter = new EventEmitter<OrderEventType>();

  @Input()
  order!: Order;
  orderPayment: OrderPayment | null = {} as OrderPayment;
  editForm = this.fb.group({
    id: [],
    orderId: [null, [Validators.required]],
    totalPrice: [null, []],
    // credit: [null,[(control: AbstractControl) => Validators.max(this.order!.subTotal!)(control)]],
    credit: [null, []],
    debit: [null],
    eTransfer: [null],
    moneyEmail: [null],
    directDeposit: [null],
    cash: [null],
    cheque: [null],
    createdBy: [null],
    createdDate: [null],
    lastModifiedBy: [null],
    lastModifiedDate: [null],
  });

  constructor(
    protected orderPaymentService: OrderPaymentService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {}
  ngOnInit(): void {
    const orderId: any = this.order.id;
    this.orderPaymentService.findByOrderId(orderId).subscribe(res => {
      const orderPayment = res.body;
      this.orderPayment = orderPayment;
      this.updateForm();
    });
  }

  updateForm(): void {
    const orderPayment: any = this.orderPayment;
    this.editForm.patchValue({
      id: orderPayment.id,
      orderId: orderPayment.orderId,
      totalPrice: orderPayment.totalPrice,
      credit: orderPayment.credit,
      debit: orderPayment.debit,
      eTransfer: orderPayment.eTransfer,
      moneyEmail: orderPayment.moneyEmail,
      directDeposit: orderPayment.directDeposit,
      cash: orderPayment.cash,
      cheque: orderPayment.cheque,
      createdBy: orderPayment.createdBy,
      createdDate: orderPayment.createdDate ? orderPayment.createdDate.format(DATE_TIME_FORMAT) : null,
      lastModifiedBy: orderPayment.lastModifiedBy,
      lastModifiedDate: orderPayment.lastModifiedDate ? orderPayment.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
    });
  }

  onCancel(): void {
    this.eventEmitter.emit(OrderEventType.ORDER_PRODUCT_LIST);
  }

  save(): void {
    const orderPayment = this.createFromForm();
    const orderPaymentUpdate = {} as OrderPaymentUpdate;
    orderPaymentUpdate.orderPayment = orderPayment;
    orderPaymentUpdate.order = this.order;
    this.subscribeToSaveResponse(this.orderPaymentService.saveForUpdate(orderPaymentUpdate));
  }

  private createFromForm(): OrderPayment {
    const orderPayment = {} as OrderPayment;
    const lastModifiedDate: any = this.editForm.get(['lastModifiedDate'])!.value
      ? (this.editForm.get(['lastModifiedDate'])!.value as Dayjs).format(DATE_TIME_FORMAT).toString()
      : null;

    const createdDate: any = this.editForm.get(['createdDate'])!.value
      ? (this.editForm.get(['createdDate'])!.value as Dayjs).format(DATE_TIME_FORMAT).toString()
      : null;

    (orderPayment.id = this.editForm.get(['id'])!.value),
      (orderPayment.orderId = this.editForm.get(['orderId'])!.value),
      (orderPayment.totalPrice = this.editForm.get(['totalPrice'])!.value),
      (orderPayment.credit = this.editForm.get(['credit'])!.value),
      (orderPayment.debit = this.editForm.get(['debit'])!.value),
      (orderPayment.eTransfer = this.editForm.get(['eTransfer'])!.value),
      (orderPayment.moneyEmail = this.editForm.get(['moneyEmail'])!.value),
      (orderPayment.directDeposit = this.editForm.get(['directDeposit'])!.value),
      (orderPayment.cash = this.editForm.get(['cash'])!.value),
      (orderPayment.cheque = this.editForm.get(['cheque'])!.value),
      (orderPayment.createdBy = this.editForm.get(['createdBy'])!.value),
      (orderPayment.createdDate = createdDate),
      (orderPayment.lastModifiedDate = lastModifiedDate);

    return orderPayment;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<OrderPaymentUpdate>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body));
  }

  protected onSaveSuccess(orderPaymentUpdate: any): void {
    this.orderPayment = orderPaymentUpdate.orderPayment;
    this.order = orderPaymentUpdate.order;

    if (this.order.status !== 'Draft') {
      this.eventEmitter.emit(OrderEventType.ORDER_PLACEMENT);
    }
  }

  getGrandTotal() {
    const x: number = this.order?.taxTotal === undefined || this.order?.taxTotal === null ? 0.0 : this.order?.taxTotal;
    const y: number = this.order?.subTotal === undefined || this.order?.subTotal === null ? 0.0 : this.order?.subTotal;
    return x + y;
  }

  ifCanSave() {
    if (this.order.status === 'Placed') {
      return false;
    }

    let total: number =
      this.editForm.get(['credit'])!.value +
      this.editForm.get(['debit'])!.value +
      this.editForm.get(['eTransfer'])!.value +
      this.editForm.get(['moneyEmail'])!.value +
      this.editForm.get(['directDeposit'])!.value +
      this.editForm.get(['cash'])!.value +
      this.editForm.get(['cheque'])!.value;

    const subTotal: number | null = this.order === undefined || this.order.subTotal === undefined ? 0.0 : this.order.subTotal;
    const taxTotal: number | null = this.order === undefined || this.order.taxTotal === undefined ? 0.0 : this.order.taxTotal;
    if (subTotal !== null && taxTotal !== null) {
      const grandTotal: number = Math.round((subTotal + taxTotal + Number.EPSILON) * 100) / 100;
      total = Math.round((total + Number.EPSILON) * 100) / 100;
      if (total === grandTotal) {
        return true;
      }
    }

    return false;
  }

  ifCanPlaced() {
    if (this.ifCanSave() && this.order.status === 'Draft') {
      return true;
    }

    return false;
  }

  onPlaceOrder() {
    if (this.ifCanPlaced()) {
      const orderPayment = this.createFromForm();
      const orderPaymentUpdate = new OrderPaymentUpdate();
      orderPaymentUpdate.orderPayment = orderPayment;
      const order: Order = this.order;
      order.status = 'Placed';
      this.order = order;
      orderPaymentUpdate.order = this.order;
      this.subscribeToSaveResponse(this.orderPaymentService.saveForUpdate(orderPaymentUpdate));
    }
  }
}
