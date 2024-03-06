import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { FeeTypeComponent } from './list/fee-type.component';
import { FeeTypeDetailComponent } from './detail/fee-type-detail.component';
import { FeeTypeUpdateComponent } from './update/fee-type-update.component';
import FeeTypeResolve from './route/fee-type-routing-resolve.service';

const feeTypeRoute: Routes = [
  {
    path: '',
    component: FeeTypeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FeeTypeDetailComponent,
    resolve: {
      feeType: FeeTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FeeTypeUpdateComponent,
    resolve: {
      feeType: FeeTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FeeTypeUpdateComponent,
    resolve: {
      feeType: FeeTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default feeTypeRoute;
