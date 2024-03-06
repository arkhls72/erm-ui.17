import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ProductOrder } from '../product-order.model';
import { ProductOrderService } from '../service/product-order.service';

export const productOrderResolve = (route: ActivatedRouteSnapshot): Observable<null | ProductOrder> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProductOrderService)
      .find(id)
      .pipe(
        mergeMap((productOrder: HttpResponse<ProductOrder>) => {
          if (productOrder.body) {
            return of(productOrder.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default productOrderResolve;
