import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProgComponent } from './list/prog.component';
import { ProgDetailComponent } from './detail/prog-detail.component';
import { ProgUpdateComponent } from './update/prog-update.component';
import ProgResolve from './route/prog-routing-resolve.service';

const progRoute: Routes = [
  {
    path: '',
    component: ProgComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProgDetailComponent,
    resolve: {
      prog: ProgResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProgUpdateComponent,
    resolve: {
      prog: ProgResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProgUpdateComponent,
    resolve: {
      prog: ProgResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default progRoute;
