import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Product } from '../product.model';
import { ProductService } from '../service/product.service';

export const productResolve = (route: ActivatedRouteSnapshot): Observable<null | Product> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProductService)
      .find(id)
      .pipe(
        mergeMap((product: HttpResponse<Product>) => {
          if (product.body) {
            return of(product.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default productResolve;
