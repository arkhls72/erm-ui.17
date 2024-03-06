import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ClientInvoice } from '../client-invoice.model';
import { ClientInvoiceService } from '../service/client-invoice.service';

export const clientInvoiceResolve = (route: ActivatedRouteSnapshot): Observable<null | ClientInvoice> => {
  const id = route.params['id'];
  if (id) {
    return inject(ClientInvoiceService)
      .find(id)
      .pipe(
        mergeMap((clientInvoice: HttpResponse<ClientInvoice>) => {
          if (clientInvoice.body) {
            return of(clientInvoice.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default clientInvoiceResolve;
