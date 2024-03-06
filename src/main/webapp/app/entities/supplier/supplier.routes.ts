import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { SupplierComponent } from './list/supplier.component';
import { SupplierDetailComponent } from './detail/supplier-detail.component';
import { SupplierUpdateComponent } from './update/supplier-update.component';
import SupplierResolve from './route/supplier-routing-resolve.service';

const supplierRoute: Routes = [
  {
    path: '',
    component: SupplierComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SupplierDetailComponent,
    resolve: {
      supplier: SupplierResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SupplierUpdateComponent,
    resolve: {
      supplier: SupplierResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SupplierUpdateComponent,
    resolve: {
      supplier: SupplierResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default supplierRoute;
