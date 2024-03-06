import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PaymentInvoiceDetailsComponent } from './list/payment-invoice-details.component';
import { PaymentInvoiceDetailsDetailComponent } from './detail/payment-invoice-details-detail.component';
import { PaymentInvoiceDetailsUpdateComponent } from './update/payment-invoice-details-update.component';
import PaymentInvoiceDetailsResolve from './route/payment-invoice-details-routing-resolve.service';

const paymentInvoiceDetailsRoute: Routes = [
  {
    path: '',
    component: PaymentInvoiceDetailsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PaymentInvoiceDetailsDetailComponent,
    resolve: {
      paymentInvoiceDetails: PaymentInvoiceDetailsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PaymentInvoiceDetailsUpdateComponent,
    resolve: {
      paymentInvoiceDetails: PaymentInvoiceDetailsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PaymentInvoiceDetailsUpdateComponent,
    resolve: {
      paymentInvoiceDetails: PaymentInvoiceDetailsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default paymentInvoiceDetailsRoute;
