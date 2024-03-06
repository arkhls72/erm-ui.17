import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { OrderPayment } from '../order-payment.model';
import { OrderPaymentService } from '../service/order-payment.service';

@Component({
  standalone: true,
  templateUrl: './order-payment-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class OrderPaymentDeleteDialogComponent {
  orderPayment?: OrderPayment;

  constructor(
    protected orderPaymentService: OrderPaymentService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.orderPaymentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
