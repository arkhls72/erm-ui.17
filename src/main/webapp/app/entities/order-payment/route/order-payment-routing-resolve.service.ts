import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { OrderPayment } from '../order-payment.model';
import { OrderPaymentService } from '../service/order-payment.service';

export const orderPaymentResolve = (route: ActivatedRouteSnapshot): Observable<null | OrderPayment> => {
  const id = route.params['id'];
  if (id) {
    return inject(OrderPaymentService)
      .find(id)
      .pipe(
        mergeMap((orderPayment: HttpResponse<OrderPayment>) => {
          if (orderPayment.body) {
            return of(orderPayment.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default orderPaymentResolve;
