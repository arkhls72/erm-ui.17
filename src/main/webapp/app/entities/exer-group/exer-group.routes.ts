import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ExerGroupComponent } from './list/exer-group.component';
import { ExerGroupDetailComponent } from './detail/exer-group-detail.component';
import { ExerGroupUpdateComponent } from './update/exer-group-update.component';
import ExerGroupResolve from './route/exer-group-routing-resolve.service';

const exerGroupRoute: Routes = [
  {
    path: '',
    component: ExerGroupComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExerGroupDetailComponent,
    resolve: {
      exerGroup: ExerGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExerGroupUpdateComponent,
    resolve: {
      exerGroup: ExerGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExerGroupUpdateComponent,
    resolve: {
      exerGroup: ExerGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default exerGroupRoute;
