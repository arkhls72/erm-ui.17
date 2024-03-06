import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Order } from '../order.model';
import { OrderService } from '../service/order.service';

export const orderResolve = (route: ActivatedRouteSnapshot): Observable<null | Order> => {
  const id = route.params['id'];
  if (id) {
    return inject(OrderService)
      .find(id)
      .pipe(
        mergeMap((order: HttpResponse<Order>) => {
          if (order.body) {
            return of(order.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default orderResolve;
