import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MovementComponent } from './list/movement.component';
import { MovementDetailComponent } from './detail/movement-detail.component';
import { MovementUpdateComponent } from './update/movement-update.component';
import MovementResolve from './route/movement-routing-resolve.service';

const movementRoute: Routes = [
  {
    path: '',
    component: MovementComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MovementDetailComponent,
    resolve: {
      movement: MovementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MovementUpdateComponent,
    resolve: {
      movement: MovementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MovementUpdateComponent,
    resolve: {
      movement: MovementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default movementRoute;
