import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Muscle } from '../muscle.model';
import { MuscleService } from '../service/muscle.service';

export const muscleResolve = (route: ActivatedRouteSnapshot): Observable<null | Muscle> => {
  const id = route.params['id'];
  if (id) {
    return inject(MuscleService)
      .find(id)
      .pipe(
        mergeMap((muscle: HttpResponse<Muscle>) => {
          if (muscle.body) {
            return of(muscle.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default muscleResolve;
