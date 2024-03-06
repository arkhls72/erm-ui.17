import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { PaymentInvoiceDetails } from '../payment-invoice-details.model';

@Component({
  standalone: true,
  selector: 'jhi-payment-invoice-details-detail',
  templateUrl: './payment-invoice-details-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PaymentInvoiceDetailsDetailComponent {
  @Input() paymentInvoiceDetails: PaymentInvoiceDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
