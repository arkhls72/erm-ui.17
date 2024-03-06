import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CoverageComponent } from './list/coverage.component';
import { CoverageDetailComponent } from './detail/coverage-detail.component';
import { CoverageUpdateComponent } from './update/coverage-update.component';
import CoverageResolve from './route/coverage-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const coverageRoute: Routes = [
  {
    path: '',
    component: CoverageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CoverageDetailComponent,
    resolve: {
      coverage: CoverageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CoverageUpdateComponent,
    resolve: {
      coverage: CoverageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CoverageUpdateComponent,
    resolve: {
      coverage: CoverageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default coverageRoute;
