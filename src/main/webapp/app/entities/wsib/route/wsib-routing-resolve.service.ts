import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Wsib } from '../wsib.model';
import { WsibService } from '../service/wsib.service';

export const wsibResolve = (route: ActivatedRouteSnapshot): Observable<null | Wsib> => {
  const id = route.params['id'];
  if (id) {
    return inject(WsibService)
      .find(id)
      .pipe(
        mergeMap((wsib: HttpResponse<Wsib>) => {
          if (wsib.body) {
            return of(wsib.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default wsibResolve;
