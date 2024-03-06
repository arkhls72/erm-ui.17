import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Media } from '../media.model';
import { MediaService } from '../service/media.service';

export const mediaResolve = (route: ActivatedRouteSnapshot): Observable<null | Media> => {
  const id = route.params['id'];
  if (id) {
    return inject(MediaService)
      .find(id)
      .pipe(
        mergeMap((media: HttpResponse<Media>) => {
          if (media.body) {
            return of(media.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default mediaResolve;
