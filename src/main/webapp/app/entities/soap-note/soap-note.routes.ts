import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { SoapNoteComponent } from './list/soap-note.component';
import { SoapNoteDetailComponent } from './detail/soap-note-detail.component';
import { SoapNoteUpdateComponent } from './update/soap-note-update.component';
import SoapNoteResolve from './route/soap-note-routing-resolve.service';

const soapNoteRoute: Routes = [
  {
    path: '',
    component: SoapNoteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SoapNoteDetailComponent,
    resolve: {
      soapNote: SoapNoteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SoapNoteUpdateComponent,
    resolve: {
      soapNote: SoapNoteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SoapNoteUpdateComponent,
    resolve: {
      soapNote: SoapNoteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default soapNoteRoute;
