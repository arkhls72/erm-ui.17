import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ExerGroupDetaillComponent } from './list/exer-group-detaill.component';
import { ExerGroupDetaillDetailComponent } from './detail/exer-group-detaill-detail.component';
import { ExerGroupDetaillUpdateComponent } from './update/exer-group-detaill-update.component';
import ExerGroupDetaillResolve from './route/exer-group-detaill-routing-resolve.service';

const exerGroupDetaillRoute: Routes = [
  {
    path: '',
    component: ExerGroupDetaillComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExerGroupDetaillDetailComponent,
    resolve: {
      exerGroupDetaill: ExerGroupDetaillResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExerGroupDetaillUpdateComponent,
    resolve: {
      exerGroupDetaill: ExerGroupDetaillResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExerGroupDetaillUpdateComponent,
    resolve: {
      exerGroupDetaill: ExerGroupDetaillResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default exerGroupDetaillRoute;
