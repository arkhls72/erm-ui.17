import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { EhcPrimaryComponent } from './list/ehc-primary.component';
import { EhcPrimaryDetailComponent } from './detail/ehc-primary-detail.component';
import { EhcPrimaryUpdateComponent } from './update/ehc-primary-update.component';
import EhcPrimaryResolve from './route/ehc-primary-routing-resolve.service';

const ehcPrimaryRoute: Routes = [
  {
    path: '',
    component: EhcPrimaryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EhcPrimaryDetailComponent,
    resolve: {
      ehcPrimary: EhcPrimaryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EhcPrimaryUpdateComponent,
    resolve: {
      ehcPrimary: EhcPrimaryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EhcPrimaryUpdateComponent,
    resolve: {
      ehcPrimary: EhcPrimaryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ehcPrimaryRoute;
