import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { BodyPart } from '../body-part.model';
import { BodyPartService } from '../service/body-part.service';

export const bodyPartResolve = (route: ActivatedRouteSnapshot): Observable<null | BodyPart> => {
  const id = route.params['id'];
  if (id) {
    return inject(BodyPartService)
      .find(id)
      .pipe(
        mergeMap((bodyPart: HttpResponse<BodyPart>) => {
          if (bodyPart.body) {
            return of(bodyPart.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default bodyPartResolve;
