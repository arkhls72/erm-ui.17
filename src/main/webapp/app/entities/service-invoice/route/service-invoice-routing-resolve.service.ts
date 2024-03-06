import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ServiceInvoice } from '../service-invoice.model';
import { ServiceInvoiceService } from '../service/service-invoice.service';

export const serviceInvoiceResolve = (route: ActivatedRouteSnapshot): Observable<null | ServiceInvoice> => {
  const id = route.params['id'];
  if (id) {
    return inject(ServiceInvoiceService)
      .find(id)
      .pipe(
        mergeMap((serviceInvoice: HttpResponse<ServiceInvoice>) => {
          if (serviceInvoice.body) {
            return of(serviceInvoice.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default serviceInvoiceResolve;
