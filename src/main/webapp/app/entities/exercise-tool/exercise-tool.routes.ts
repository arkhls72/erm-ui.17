import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ExerciseToolComponent } from './list/exercise-tool.component';
import { ExerciseToolDetailComponent } from './detail/exercise-tool-detail.component';
import { ExerciseToolUpdateComponent } from './update/exercise-tool-update.component';
import ExerciseToolResolve from './route/exercise-tool-routing-resolve.service';

const exerciseToolRoute: Routes = [
  {
    path: '',
    component: ExerciseToolComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExerciseToolDetailComponent,
    resolve: {
      exerciseTool: ExerciseToolResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExerciseToolUpdateComponent,
    resolve: {
      exerciseTool: ExerciseToolResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExerciseToolUpdateComponent,
    resolve: {
      exerciseTool: ExerciseToolResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default exerciseToolRoute;
