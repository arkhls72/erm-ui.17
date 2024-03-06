import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PaymentInvoiceComponent } from './list/payment-invoice.component';
import { PaymentInvoiceDetailComponent } from './detail/payment-invoice-detail.component';
import { PaymentInvoiceUpdateComponent } from './update/payment-invoice-update.component';
import PaymentInvoiceResolve from './route/payment-invoice-routing-resolve.service';

const paymentInvoiceRoute: Routes = [
  {
    path: '',
    component: PaymentInvoiceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PaymentInvoiceDetailComponent,
    resolve: {
      paymentInvoice: PaymentInvoiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PaymentInvoiceUpdateComponent,
    resolve: {
      paymentInvoice: PaymentInvoiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PaymentInvoiceUpdateComponent,
    resolve: {
      paymentInvoice: PaymentInvoiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default paymentInvoiceRoute;
