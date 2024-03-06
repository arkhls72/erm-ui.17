import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ClientInvoice } from '../client-invoice.model';
import { ClientInvoiceService } from '../service/client-invoice.service';

@Component({
  standalone: true,
  templateUrl: './client-invoice-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ClientInvoiceDeleteDialogComponent {
  clientInvoice?: ClientInvoice;

  constructor(
    protected clientInvoiceService: ClientInvoiceService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.clientInvoiceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
