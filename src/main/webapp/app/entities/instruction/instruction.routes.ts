import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { InstructionComponent } from './list/instruction.component';
import { InstructionDetailComponent } from './detail/instruction-detail.component';
import { InstructionUpdateComponent } from './update/instruction-update.component';
import InstructionResolve from './route/instruction-routing-resolve.service';

const instructionRoute: Routes = [
  {
    path: '',
    component: InstructionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InstructionDetailComponent,
    resolve: {
      instruction: InstructionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InstructionUpdateComponent,
    resolve: {
      instruction: InstructionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InstructionUpdateComponent,
    resolve: {
      instruction: InstructionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default instructionRoute;
