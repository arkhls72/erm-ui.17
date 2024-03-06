import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Province } from '../province.model';
import { ProvinceService } from '../service/province.service';

export const provinceResolve = (route: ActivatedRouteSnapshot): Observable<null | Province> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProvinceService)
      .find(id)
      .pipe(
        mergeMap((province: HttpResponse<Province>) => {
          if (province.body) {
            return of(province.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default provinceResolve;
