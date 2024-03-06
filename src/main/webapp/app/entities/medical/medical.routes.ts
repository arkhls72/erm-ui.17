import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MedicalComponent } from './list/medical.component';
import { MedicalDetailComponent } from './detail/medical-detail.component';
import { MedicalUpdateComponent } from './update/medical-update.component';
import MedicalResolve from './route/medical-routing-resolve.service';

const medicalRoute: Routes = [
  {
    path: '',
    component: MedicalComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MedicalDetailComponent,
    resolve: {
      medical: MedicalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MedicalUpdateComponent,
    resolve: {
      medical: MedicalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MedicalUpdateComponent,
    resolve: {
      medical: MedicalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default medicalRoute;
