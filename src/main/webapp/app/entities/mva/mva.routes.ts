import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MvaComponent } from './list/mva.component';
import { MvaDetailComponent } from './detail/mva-detail.component';
import { MvaUpdateComponent } from './update/mva-update.component';
import MvaResolve from './route/mva-routing-resolve.service';

const mvaRoute: Routes = [
  {
    path: '',
    component: MvaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MvaDetailComponent,
    resolve: {
      mva: MvaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MvaUpdateComponent,
    resolve: {
      mva: MvaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MvaUpdateComponent,
    resolve: {
      mva: MvaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default mvaRoute;
