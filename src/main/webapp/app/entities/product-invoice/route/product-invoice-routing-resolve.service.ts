import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ProductInvoice } from '../product-invoice.model';
import { ProductInvoiceService } from '../service/product-invoice.service';

export const productInvoiceResolve = (route: ActivatedRouteSnapshot): Observable<null | ProductInvoice> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProductInvoiceService)
      .find(id)
      .pipe(
        mergeMap((productInvoice: HttpResponse<ProductInvoice>) => {
          if (productInvoice.body) {
            return of(productInvoice.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default productInvoiceResolve;
