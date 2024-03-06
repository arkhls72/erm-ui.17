import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { EhcClientComponent } from './list/ehc-client.component';
import { EhcClientDetailComponent } from './detail/ehc-client-detail.component';
import { EhcClientUpdateComponent } from './update/ehc-client-update.component';
import EhcClientResolve from './route/ehc-client-routing-resolve.service';

const ehcClientRoute: Routes = [
  {
    path: '',
    component: EhcClientComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EhcClientDetailComponent,
    resolve: {
      ehcClient: EhcClientResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EhcClientUpdateComponent,
    resolve: {
      ehcClient: EhcClientResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EhcClientUpdateComponent,
    resolve: {
      ehcClient: EhcClientResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ehcClientRoute;
