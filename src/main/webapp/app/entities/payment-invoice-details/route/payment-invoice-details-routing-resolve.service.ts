import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { PaymentInvoiceDetails } from '../payment-invoice-details.model';
import { PaymentInvoiceDetailsService } from '../service/payment-invoice-details.service';

export const paymentInvoiceDetailsResolve = (route: ActivatedRouteSnapshot): Observable<null | PaymentInvoiceDetails> => {
  const id = route.params['id'];
  if (id) {
    return inject(PaymentInvoiceDetailsService)
      .find(id)
      .pipe(
        mergeMap((paymentInvoiceDetails: HttpResponse<PaymentInvoiceDetails>) => {
          if (paymentInvoiceDetails.body) {
            return of(paymentInvoiceDetails.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default paymentInvoiceDetailsResolve;
