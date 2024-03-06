import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { BodyPartComponent } from './list/body-part.component';
import { BodyPartDetailComponent } from './detail/body-part-detail.component';
import { BodyPartUpdateComponent } from './update/body-part-update.component';
import BodyPartResolve from './route/body-part-routing-resolve.service';

const bodyPartRoute: Routes = [
  {
    path: '',
    component: BodyPartComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BodyPartDetailComponent,
    resolve: {
      bodyPart: BodyPartResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BodyPartUpdateComponent,
    resolve: {
      bodyPart: BodyPartResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BodyPartUpdateComponent,
    resolve: {
      bodyPart: BodyPartResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default bodyPartRoute;
