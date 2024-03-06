import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ExerciseComponent } from './list/exercise.component';
import { ExerciseDetailComponent } from './detail/exercise-detail.component';
import { ExerciseUpdateComponent } from './update/exercise-update.component';
import ExerciseResolve from './route/exercise-routing-resolve.service';

const exerciseRoute: Routes = [
  {
    path: '',
    component: ExerciseComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExerciseDetailComponent,
    resolve: {
      exercise: ExerciseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExerciseUpdateComponent,
    resolve: {
      exercise: ExerciseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExerciseUpdateComponent,
    resolve: {
      exercise: ExerciseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default exerciseRoute;
