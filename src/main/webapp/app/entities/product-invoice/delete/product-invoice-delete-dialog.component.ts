import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ProductInvoice } from '../product-invoice.model';
import { ProductInvoiceService } from '../service/product-invoice.service';

@Component({
  standalone: true,
  templateUrl: './product-invoice-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ProductInvoiceDeleteDialogComponent {
  productInvoice?: ProductInvoice;

  constructor(
    protected productInvoiceService: ProductInvoiceService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productInvoiceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
