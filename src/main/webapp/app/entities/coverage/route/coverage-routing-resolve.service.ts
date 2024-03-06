import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Coverage } from '../coverage.model';
import { CoverageService } from '../service/coverage.service';

export const coverageResolve = (route: ActivatedRouteSnapshot): Observable<null | Coverage> => {
  const id = route.params['id'];
  if (id) {
    return inject(CoverageService)
      .find(id)
      .pipe(
        mergeMap((coverage: HttpResponse<Coverage>) => {
          if (coverage.body) {
            return of(coverage.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default coverageResolve;
