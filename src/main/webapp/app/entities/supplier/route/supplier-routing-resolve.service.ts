import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Supplier } from '../supplier.model';
import { SupplierService } from '../service/supplier.service';

export const supplierResolve = (route: ActivatedRouteSnapshot): Observable<null | Supplier> => {
  const id = route.params['id'];
  if (id) {
    return inject(SupplierService)
      .find(id)
      .pipe(
        mergeMap((supplier: HttpResponse<Supplier>) => {
          if (supplier.body) {
            return of(supplier.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default supplierResolve;
