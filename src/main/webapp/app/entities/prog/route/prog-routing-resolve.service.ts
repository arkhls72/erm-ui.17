import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Prog } from '../prog.model';
import { ProgService } from '../service/prog.service';

export const progResolve = (route: ActivatedRouteSnapshot): Observable<null | Prog> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProgService)
      .find(id)
      .pipe(
        mergeMap((prog: HttpResponse<Prog>) => {
          if (prog.body) {
            return of(prog.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default progResolve;
