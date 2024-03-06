import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MuscleComponent } from './list/muscle.component';
import { MuscleDetailComponent } from './detail/muscle-detail.component';
import { MuscleUpdateComponent } from './update/muscle-update.component';
import MuscleResolve from './route/muscle-routing-resolve.service';

const muscleRoute: Routes = [
  {
    path: '',
    component: MuscleComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MuscleDetailComponent,
    resolve: {
      muscle: MuscleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MuscleUpdateComponent,
    resolve: {
      muscle: MuscleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MuscleUpdateComponent,
    resolve: {
      muscle: MuscleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default muscleRoute;
