import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProductInvoiceComponent } from './list/product-invoice.component';
import { ProductInvoiceDetailComponent } from './detail/product-invoice-detail.component';
import { ProductInvoiceUpdateComponent } from './update/product-invoice-update.component';
import ProductInvoiceResolve from './route/product-invoice-routing-resolve.service';

const productInvoiceRoute: Routes = [
  {
    path: '',
    component: ProductInvoiceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductInvoiceDetailComponent,
    resolve: {
      productInvoice: ProductInvoiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductInvoiceUpdateComponent,
    resolve: {
      productInvoice: ProductInvoiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductInvoiceUpdateComponent,
    resolve: {
      productInvoice: ProductInvoiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default productInvoiceRoute;
