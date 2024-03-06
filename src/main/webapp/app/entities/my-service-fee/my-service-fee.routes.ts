import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MyServiceFeeComponent } from './list/my-service-fee.component';
import { MyServiceFeeDetailComponent } from './detail/my-service-fee-detail.component';
import { MyServiceFeeUpdateComponent } from './update/my-service-fee-update.component';
import MyServiceFeeResolve from './route/my-service-fee-routing-resolve.service';

const myServiceFeeRoute: Routes = [
  {
    path: '',
    component: MyServiceFeeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MyServiceFeeDetailComponent,
    resolve: {
      myServiceFee: MyServiceFeeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MyServiceFeeUpdateComponent,
    resolve: {
      myServiceFee: MyServiceFeeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MyServiceFeeUpdateComponent,
    resolve: {
      myServiceFee: MyServiceFeeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default myServiceFeeRoute;
