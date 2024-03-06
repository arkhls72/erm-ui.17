import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProductSpecificationComponent } from './list/product-specification.component';
import { ProductSpecificationDetailComponent } from './detail/product-specification-detail.component';
import { ProductSpecificationUpdateComponent } from './update/product-specification-update.component';
import ProductSpecificationResolve from './route/product-specification-routing-resolve.service';

const productSpecificationRoute: Routes = [
  {
    path: '',
    component: ProductSpecificationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductSpecificationDetailComponent,
    resolve: {
      productSpecification: ProductSpecificationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductSpecificationUpdateComponent,
    resolve: {
      productSpecification: ProductSpecificationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductSpecificationUpdateComponent,
    resolve: {
      productSpecification: ProductSpecificationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default productSpecificationRoute;
