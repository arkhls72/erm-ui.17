import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { PaymentInvoiceDetails } from '../payment-invoice-details.model';
import { PaymentInvoiceDetailsService } from '../service/payment-invoice-details.service';

@Component({
  standalone: true,
  templateUrl: './payment-invoice-details-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PaymentInvoiceDetailsDeleteDialogComponent {
  paymentInvoiceDetails?: PaymentInvoiceDetails;

  constructor(
    protected paymentInvoiceDetailsService: PaymentInvoiceDetailsService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paymentInvoiceDetailsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
