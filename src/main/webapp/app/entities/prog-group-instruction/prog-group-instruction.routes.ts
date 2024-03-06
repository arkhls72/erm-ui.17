import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProgGroupInstructionComponent } from './list/prog-group-instruction.component';
import { ProgGroupInstructionDetailComponent } from './detail/prog-group-instruction-detail.component';
import { ProgGroupInstructionUpdateComponent } from './update/prog-group-instruction-update.component';
import ProgGroupInstructionResolve from './route/prog-group-instruction-routing-resolve.service';

const progGroupInstructionRoute: Routes = [
  {
    path: '',
    component: ProgGroupInstructionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProgGroupInstructionDetailComponent,
    resolve: {
      progGroupInstruction: ProgGroupInstructionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProgGroupInstructionUpdateComponent,
    resolve: {
      progGroupInstruction: ProgGroupInstructionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProgGroupInstructionUpdateComponent,
    resolve: {
      progGroupInstruction: ProgGroupInstructionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default progGroupInstructionRoute;
