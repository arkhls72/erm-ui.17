import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProvinceComponent } from './list/province.component';
import { ProvinceDetailComponent } from './detail/province-detail.component';
import { ProvinceUpdateComponent } from './update/province-update.component';
import ProvinceResolve from './route/province-routing-resolve.service';

const provinceRoute: Routes = [
  {
    path: '',
    component: ProvinceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProvinceDetailComponent,
    resolve: {
      province: ProvinceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProvinceUpdateComponent,
    resolve: {
      province: ProvinceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProvinceUpdateComponent,
    resolve: {
      province: ProvinceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default provinceRoute;
