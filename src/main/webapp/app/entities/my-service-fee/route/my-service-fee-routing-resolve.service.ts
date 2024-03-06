import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { MyServiceFee } from '../my-service-fee.model';
import { MyServiceFeeService } from '../service/my-service-fee.service';

export const myServiceFeeResolve = (route: ActivatedRouteSnapshot): Observable<null | MyServiceFee> => {
  const id = route.params['id'];
  if (id) {
    return inject(MyServiceFeeService)
      .find(id)
      .pipe(
        mergeMap((myServiceFee: HttpResponse<MyServiceFee>) => {
          if (myServiceFee.body) {
            return of(myServiceFee.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default myServiceFeeResolve;
