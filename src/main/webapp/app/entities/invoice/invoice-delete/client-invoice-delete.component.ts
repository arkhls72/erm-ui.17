import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Invoice } from 'app/entities/invoice/invoice.model';
import { InvoicePageType } from 'app/entities/local-share/invoice-page';
import { InvoiceService } from '../service/invoice.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'bc-client-invoice-delete',
  templateUrl: './client-invoice-delete.component.html',
  imports: [FaIconComponent, FormsModule],
})
export class ClientInvoiceDeleteComponent {
  @Input()
  invoice?: Invoice;
  invoicePage: InvoicePageType = InvoicePageType.INVOICE_DELETE;
  @Output()
  deleteInvoiceEventEmitter = new EventEmitter();
  constructor(
    protected invoiceService: InvoiceService,
    public activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.invoicePage = InvoicePageType.INVOICE_LIST;
  }

  confirmDelete(): void {
    this.invoiceService.delete(this.invoice!.id!).subscribe(() => {
      this.invoicePage = InvoicePageType.INVOICE_LIST;
      this.deleteInvoiceEventEmitter.emit();
    });
  }
}
