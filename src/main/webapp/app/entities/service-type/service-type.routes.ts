import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ServiceTypeComponent } from './list/service-type.component';
import { ServiceTypeDetailComponent } from './detail/service-type-detail.component';
import { ServiceTypeUpdateComponent } from './update/service-type-update.component';
import ServiceTypeResolve from './route/service-type-routing-resolve.service';

const serviceTypeRoute: Routes = [
  {
    path: '',
    component: ServiceTypeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceTypeDetailComponent,
    resolve: {
      serviceType: ServiceTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceTypeUpdateComponent,
    resolve: {
      serviceType: ServiceTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceTypeUpdateComponent,
    resolve: {
      serviceType: ServiceTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default serviceTypeRoute;
