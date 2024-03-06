import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { CommonServiceCode } from '../common-service-code.model';
import { CommonServiceCodeService } from '../service/common-service-code.service';

export const commonServiceCodeResolve = (route: ActivatedRouteSnapshot): Observable<null | CommonServiceCode> => {
  const id = route.params['id'];
  if (id) {
    return inject(CommonServiceCodeService)
      .find(id)
      .pipe(
        mergeMap((commonServiceCode: HttpResponse<CommonServiceCode>) => {
          if (commonServiceCode.body) {
            return of(commonServiceCode.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default commonServiceCodeResolve;
