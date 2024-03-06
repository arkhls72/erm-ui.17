import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { PaymentInvoice } from '../payment-invoice.model';
import { PaymentInvoiceService } from '../service/payment-invoice.service';

export const paymentInvoiceResolve = (route: ActivatedRouteSnapshot): Observable<null | PaymentInvoice> => {
  const id = route.params['id'];
  if (id) {
    return inject(PaymentInvoiceService)
      .find(id)
      .pipe(
        mergeMap((paymentInvoice: HttpResponse<PaymentInvoice>) => {
          if (paymentInvoice.body) {
            return of(paymentInvoice.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default paymentInvoiceResolve;
