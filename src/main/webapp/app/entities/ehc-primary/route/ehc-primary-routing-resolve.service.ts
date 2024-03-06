import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { EhcPrimary } from '../ehc-primary.model';
import { EhcPrimaryService } from '../service/ehc-primary.service';

export const ehcPrimaryResolve = (route: ActivatedRouteSnapshot): Observable<null | EhcPrimary> => {
  const id = route.params['id'];
  if (id) {
    return inject(EhcPrimaryService)
      .find(id)
      .pipe(
        mergeMap((ehcPrimary: HttpResponse<EhcPrimary>) => {
          if (ehcPrimary.body) {
            return of(ehcPrimary.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default ehcPrimaryResolve;
