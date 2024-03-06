import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CommonServiceCodeComponent } from './list/common-service-code.component';
import { CommonServiceCodeDetailComponent } from './detail/common-service-code-detail.component';
import { CommonServiceCodeUpdateComponent } from './update/common-service-code-update.component';
import CommonServiceCodeResolve from './route/common-service-code-routing-resolve.service';

const commonServiceCodeRoute: Routes = [
  {
    path: '',
    component: CommonServiceCodeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CommonServiceCodeDetailComponent,
    resolve: {
      commonServiceCode: CommonServiceCodeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CommonServiceCodeUpdateComponent,
    resolve: {
      commonServiceCode: CommonServiceCodeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CommonServiceCodeUpdateComponent,
    resolve: {
      commonServiceCode: CommonServiceCodeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default commonServiceCodeRoute;
