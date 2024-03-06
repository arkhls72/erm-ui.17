import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ClinicComponent } from './list/clinic.component';
import { ClinicDetailComponent } from './detail/clinic-detail.component';
import { ClinicUpdateComponent } from './update/clinic-update.component';
import ClinicResolve from './route/clinic-routing-resolve.service';

const clinicRoute: Routes = [
  {
    path: '',
    component: ClinicComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClinicDetailComponent,
    resolve: {
      clinic: ClinicResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClinicUpdateComponent,
    resolve: {
      clinic: ClinicResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClinicUpdateComponent,
    resolve: {
      clinic: ClinicResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default clinicRoute;
