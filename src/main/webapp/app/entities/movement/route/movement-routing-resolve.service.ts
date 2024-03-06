import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Movement } from '../movement.model';
import { MovementService } from '../service/movement.service';

export const movementResolve = (route: ActivatedRouteSnapshot): Observable<null | Movement> => {
  const id = route.params['id'];
  if (id) {
    return inject(MovementService)
      .find(id)
      .pipe(
        mergeMap((movement: HttpResponse<Movement>) => {
          if (movement.body) {
            return of(movement.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default movementResolve;
