import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Order } from 'app/entities/order/order.model';

import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { OrderService } from '../service/order.service';
@Component({
  selector: 'bc-order-delete',
  templateUrl: './order-delete.component.html',
})
export class OrderDeleteComponent {
  @Input()
  order?: Order;
  @Output()
  eventEmitter = new EventEmitter<Order>();

  constructor(
    protected orderService: OrderService,
    public activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.eventEmitter.emit(undefined);
  }

  confirmDelete(id: number): void {
    this.subscribeToDeleteResponse(this.orderService.delete(id));
  }

  protected subscribeToDeleteResponse(result: Observable<HttpResponse<{}>>): void {
    result.subscribe(() => this.onDeleteSuccess());
  }
  private onDeleteSuccess() {
    this.eventEmitter.emit(this.order);
  }
}
