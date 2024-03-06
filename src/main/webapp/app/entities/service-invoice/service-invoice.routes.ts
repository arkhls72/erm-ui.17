import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ServiceInvoiceComponent } from './list/service-invoice.component';
import { ServiceInvoiceDetailComponent } from './detail/service-invoice-detail.component';
import { ServiceInvoiceUpdateComponent } from './update/service-invoice-update.component';
import ServiceInvoiceResolve from './route/service-invoice-routing-resolve.service';

const serviceInvoiceRoute: Routes = [
  {
    path: '',
    component: ServiceInvoiceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceInvoiceDetailComponent,
    resolve: {
      serviceInvoice: ServiceInvoiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceInvoiceUpdateComponent,
    resolve: {
      serviceInvoice: ServiceInvoiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceInvoiceUpdateComponent,
    resolve: {
      serviceInvoice: ServiceInvoiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default serviceInvoiceRoute;
