import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { OrderPaymentComponent } from './list/order-payment.component';
import { OrderPaymentDetailComponent } from './detail/order-payment-detail.component';
import { OrderPaymentUpdateComponent } from './update/order-payment-update.component';
import OrderPaymentResolve from './route/order-payment-routing-resolve.service';

const orderPaymentRoute: Routes = [
  {
    path: '',
    component: OrderPaymentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrderPaymentDetailComponent,
    resolve: {
      orderPayment: OrderPaymentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrderPaymentUpdateComponent,
    resolve: {
      orderPayment: OrderPaymentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrderPaymentUpdateComponent,
    resolve: {
      orderPayment: OrderPaymentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default orderPaymentRoute;
