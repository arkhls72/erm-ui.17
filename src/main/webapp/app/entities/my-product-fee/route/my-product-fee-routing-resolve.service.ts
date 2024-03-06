import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { MyProductFee } from '../my-product-fee.model';
import { MyProductFeeService } from '../service/my-product-fee.service';

export const myProductFeeResolve = (route: ActivatedRouteSnapshot): Observable<null | MyProductFee> => {
  const id = route.params['id'];
  if (id) {
    return inject(MyProductFeeService)
      .find(id)
      .pipe(
        mergeMap((myProductFee: HttpResponse<MyProductFee>) => {
          if (myProductFee.body) {
            return of(myProductFee.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default myProductFeeResolve;
