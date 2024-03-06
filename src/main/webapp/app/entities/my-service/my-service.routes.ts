import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MyServiceComponent } from './list/my-service.component';
import { MyServiceDetailComponent } from './detail/my-service-detail.component';
import { MyServiceUpdateComponent } from './update/my-service-update.component';
import MyServiceResolve from './route/my-service-routing-resolve.service';

const myServiceRoute: Routes = [
  {
    path: '',
    component: MyServiceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MyServiceDetailComponent,
    resolve: {
      myService: MyServiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MyServiceUpdateComponent,
    resolve: {
      myService: MyServiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MyServiceUpdateComponent,
    resolve: {
      myService: MyServiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default myServiceRoute;
