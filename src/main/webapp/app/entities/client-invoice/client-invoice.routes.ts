import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ClientInvoiceComponent } from './list/client-invoice.component';
import { ClientInvoiceDetailComponent } from './detail/client-invoice-detail.component';
import { ClientInvoiceUpdateComponent } from './update/client-invoice-update.component';
import ClientInvoiceResolve from './route/client-invoice-routing-resolve.service';

const clientInvoiceRoute: Routes = [
  {
    path: '',
    component: ClientInvoiceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClientInvoiceDetailComponent,
    resolve: {
      clientInvoice: ClientInvoiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClientInvoiceUpdateComponent,
    resolve: {
      clientInvoice: ClientInvoiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClientInvoiceUpdateComponent,
    resolve: {
      clientInvoice: ClientInvoiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default clientInvoiceRoute;
