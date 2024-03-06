import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { InjuryComponent } from './list/injury.component';
import { InjuryDetailComponent } from './detail/injury-detail.component';
import { InjuryUpdateComponent } from './update/injury-update.component';
import InjuryResolve from './route/injury-routing-resolve.service';

const injuryRoute: Routes = [
  {
    path: '',
    component: InjuryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InjuryDetailComponent,
    resolve: {
      injury: InjuryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InjuryUpdateComponent,
    resolve: {
      injury: InjuryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InjuryUpdateComponent,
    resolve: {
      injury: InjuryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default injuryRoute;
