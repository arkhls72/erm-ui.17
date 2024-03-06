import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProgExerciseInstructionComponent } from './list/prog-exercise-instruction.component';
import { ProgExerciseInstructionDetailComponent } from './detail/prog-exercise-instruction-detail.component';
import { ProgExerciseInstructionUpdateComponent } from './update/prog-exercise-instruction-update.component';
import ProgExerciseInstructionResolve from './route/prog-exercise-instruction-routing-resolve.service';

const progExerciseInstructionRoute: Routes = [
  {
    path: '',
    component: ProgExerciseInstructionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProgExerciseInstructionDetailComponent,
    resolve: {
      progExerciseInstruction: ProgExerciseInstructionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProgExerciseInstructionUpdateComponent,
    resolve: {
      progExerciseInstruction: ProgExerciseInstructionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProgExerciseInstructionUpdateComponent,
    resolve: {
      progExerciseInstruction: ProgExerciseInstructionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default progExerciseInstructionRoute;
