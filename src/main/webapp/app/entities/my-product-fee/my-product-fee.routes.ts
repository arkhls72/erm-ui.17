import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MyProductFeeComponent } from './list/my-product-fee.component';
import { MyProductFeeDetailComponent } from './detail/my-product-fee-detail.component';
import { MyProductFeeUpdateComponent } from './update/my-product-fee-update.component';
import MyProductFeeResolve from './route/my-product-fee-routing-resolve.service';

const myProductFeeRoute: Routes = [
  {
    path: '',
    component: MyProductFeeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MyProductFeeDetailComponent,
    resolve: {
      myProductFee: MyProductFeeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MyProductFeeUpdateComponent,
    resolve: {
      myProductFee: MyProductFeeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MyProductFeeUpdateComponent,
    resolve: {
      myProductFee: MyProductFeeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default myProductFeeRoute;
