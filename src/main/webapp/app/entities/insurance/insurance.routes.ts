import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { InsuranceComponent } from './list/insurance.component';
import { InsuranceDetailComponent } from './detail/insurance-detail.component';
import { InsuranceUpdateComponent } from './update/insurance-update.component';
import InsuranceResolve from './route/insurance-routing-resolve.service';

const insuranceRoute: Routes = [
  {
    path: '',
    component: InsuranceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InsuranceDetailComponent,
    resolve: {
      insurance: InsuranceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InsuranceUpdateComponent,
    resolve: {
      insurance: InsuranceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InsuranceUpdateComponent,
    resolve: {
      insurance: InsuranceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default insuranceRoute;
