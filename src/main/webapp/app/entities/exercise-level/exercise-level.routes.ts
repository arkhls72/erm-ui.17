import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ExerciseLevelComponent } from './list/exercise-level.component';
import { ExerciseLevelDetailComponent } from './detail/exercise-level-detail.component';
import { ExerciseLevelUpdateComponent } from './update/exercise-level-update.component';
import ExerciseLevelResolve from './route/exercise-level-routing-resolve.service';

const exerciseLevelRoute: Routes = [
  {
    path: '',
    component: ExerciseLevelComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExerciseLevelDetailComponent,
    resolve: {
      exerciseLevel: ExerciseLevelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExerciseLevelUpdateComponent,
    resolve: {
      exerciseLevel: ExerciseLevelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExerciseLevelUpdateComponent,
    resolve: {
      exerciseLevel: ExerciseLevelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default exerciseLevelRoute;
