import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PlanNoteComponent } from './list/plan-note.component';
import { PlanNoteDetailComponent } from './detail/plan-note-detail.component';
import { PlanNoteUpdateComponent } from './update/plan-note-update.component';
import PlanNoteResolve from './route/plan-note-routing-resolve.service';

const planNoteRoute: Routes = [
  {
    path: '',
    component: PlanNoteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PlanNoteDetailComponent,
    resolve: {
      planNote: PlanNoteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PlanNoteUpdateComponent,
    resolve: {
      planNote: PlanNoteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PlanNoteUpdateComponent,
    resolve: {
      planNote: PlanNoteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default planNoteRoute;
