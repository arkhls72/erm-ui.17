import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { InvoiceItemService } from './invoice-item.service';
import invoiceResolve from '../invoice/route/invoice-routing-resolve.service';
import { InvoiceItemDetail } from './invoice-Item-detail.model';

export const invocieItemResolve = (route: ActivatedRouteSnapshot): Observable<null | InvoiceItemDetail> => {
  const id = route.params['id'];
  if (id) {
    return inject(InvoiceItemService)
      .find(id)
      .pipe(
        mergeMap((invoice: HttpResponse<InvoiceItemDetail>) => {
          if (invoice.body) {
            return of(invoice.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default invoiceResolve;
