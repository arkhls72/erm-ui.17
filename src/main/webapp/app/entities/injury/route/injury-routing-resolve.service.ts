import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Injury } from '../injury.model';
import { InjuryService } from '../service/injury.service';

export const injuryResolve = (route: ActivatedRouteSnapshot): Observable<null | Injury> => {
  const id = route.params['id'];
  if (id) {
    return inject(InjuryService)
      .find(id)
      .pipe(
        mergeMap((injury: HttpResponse<Injury>) => {
          if (injury.body) {
            return of(injury.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default injuryResolve;
