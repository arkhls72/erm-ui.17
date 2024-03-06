import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { TherapyComponent } from './list/therapy.component';
import { TherapyDetailComponent } from './detail/therapy-detail.component';
import { TherapyUpdateComponent } from './update/therapy-update.component';
import TherapyResolve from './route/therapy-routing-resolve.service';

const therapyRoute: Routes = [
  {
    path: '',
    component: TherapyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TherapyDetailComponent,
    resolve: {
      therapy: TherapyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TherapyUpdateComponent,
    resolve: {
      therapy: TherapyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TherapyUpdateComponent,
    resolve: {
      therapy: TherapyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default therapyRoute;
