import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProgExerGroupComponent } from './list/prog-exer-group.component';
import { ProgExerGroupDetailComponent } from './detail/prog-exer-group-detail.component';
import { ProgExerGroupUpdateComponent } from './update/prog-exer-group-update.component';
import ProgExerGroupResolve from './route/prog-exer-group-routing-resolve.service';

const progExerGroupRoute: Routes = [
  {
    path: '',
    component: ProgExerGroupComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProgExerGroupDetailComponent,
    resolve: {
      progExerGroup: ProgExerGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProgExerGroupUpdateComponent,
    resolve: {
      progExerGroup: ProgExerGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProgExerGroupUpdateComponent,
    resolve: {
      progExerGroup: ProgExerGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default progExerGroupRoute;
