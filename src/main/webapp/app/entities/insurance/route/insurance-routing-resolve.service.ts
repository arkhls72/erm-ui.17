import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Insurance } from '../insurance.model';
import { InsuranceService } from '../service/insurance.service';

export const insuranceResolve = (route: ActivatedRouteSnapshot): Observable<null | Insurance> => {
  const id = route.params['id'];
  if (id) {
    return inject(InsuranceService)
      .find(id)
      .pipe(
        mergeMap((insurance: HttpResponse<Insurance>) => {
          if (insurance.body) {
            return of(insurance.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default insuranceResolve;
