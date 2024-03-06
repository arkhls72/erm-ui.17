import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MediaComponent } from './list/media.component';
import { MediaDetailComponent } from './detail/media-detail.component';
import { MediaUpdateComponent } from './update/media-update.component';
import MediaResolve from './route/media-routing-resolve.service';

const mediaRoute: Routes = [
  {
    path: '',
    component: MediaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MediaDetailComponent,
    resolve: {
      media: MediaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MediaUpdateComponent,
    resolve: {
      media: MediaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MediaUpdateComponent,
    resolve: {
      media: MediaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default mediaRoute;
