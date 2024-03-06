import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProgNoteComponent } from './list/prog-note.component';
import { ProgNoteDetailComponent } from './detail/prog-note-detail.component';
import { ProgNoteUpdateComponent } from './update/prog-note-update.component';
import ProgNoteResolve from './route/prog-note-routing-resolve.service';

const progNoteRoute: Routes = [
  {
    path: '',
    component: ProgNoteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProgNoteDetailComponent,
    resolve: {
      progNote: ProgNoteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProgNoteUpdateComponent,
    resolve: {
      progNote: ProgNoteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProgNoteUpdateComponent,
    resolve: {
      progNote: ProgNoteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default progNoteRoute;
