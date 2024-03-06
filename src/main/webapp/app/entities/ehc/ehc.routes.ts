import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { EhcComponent } from './list/ehc.component';
import { EhcDetailComponent } from './detail/ehc-detail.component';
import { EhcUpdateComponent } from './update/ehc-update.component';
import EhcResolve from './route/ehc-routing-resolve.service';

const ehcRoute: Routes = [
  {
    path: '',
    component: EhcComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EhcDetailComponent,
    resolve: {
      ehc: EhcResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EhcUpdateComponent,
    resolve: {
      ehc: EhcResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EhcUpdateComponent,
    resolve: {
      ehc: EhcResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ehcRoute;
