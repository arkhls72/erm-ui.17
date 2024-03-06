import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { WsibComponent } from './list/wsib.component';
import { WsibDetailComponent } from './detail/wsib-detail.component';
import { WsibUpdateComponent } from './update/wsib-update.component';
import WsibResolve from './route/wsib-routing-resolve.service';

const wsibRoute: Routes = [
  {
    path: '',
    component: WsibComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WsibDetailComponent,
    resolve: {
      wsib: WsibResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WsibUpdateComponent,
    resolve: {
      wsib: WsibResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WsibUpdateComponent,
    resolve: {
      wsib: WsibResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default wsibRoute;
