import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Ehc } from '../ehc.model';
import { EhcService } from '../service/ehc.service';

export const ehcResolve = (route: ActivatedRouteSnapshot): Observable<null | Ehc> => {
  const id = route.params['id'];
  if (id) {
    return inject(EhcService)
      .find(id)
      .pipe(
        mergeMap((ehc: HttpResponse<Ehc>) => {
          if (ehc.body) {
            return of(ehc.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default ehcResolve;
