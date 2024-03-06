import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PositionComponent } from './list/position.component';
import { PositionDetailComponent } from './detail/position-detail.component';
import { PositionUpdateComponent } from './update/position-update.component';
import PositionResolve from './route/position-routing-resolve.service';

const positionRoute: Routes = [
  {
    path: '',
    component: PositionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PositionDetailComponent,
    resolve: {
      position: PositionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PositionUpdateComponent,
    resolve: {
      position: PositionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PositionUpdateComponent,
    resolve: {
      position: PositionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default positionRoute;
