import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ExerciseTypeComponent } from './list/exercise-type.component';
import { ExerciseTypeDetailComponent } from './detail/exercise-type-detail.component';
import { ExerciseTypeUpdateComponent } from './update/exercise-type-update.component';
import ExerciseTypeResolve from './route/exercise-type-routing-resolve.service';

const exerciseTypeRoute: Routes = [
  {
    path: '',
    component: ExerciseTypeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExerciseTypeDetailComponent,
    resolve: {
      exerciseType: ExerciseTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExerciseTypeUpdateComponent,
    resolve: {
      exerciseType: ExerciseTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExerciseTypeUpdateComponent,
    resolve: {
      exerciseType: ExerciseTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default exerciseTypeRoute;
