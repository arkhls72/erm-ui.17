import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ServiceType } from '../service-type.model';
import { ServiceTypeService } from '../service/service-type.service';

export const serviceTypeResolve = (route: ActivatedRouteSnapshot): Observable<null | ServiceType> => {
  const id = route.params['id'];
  if (id) {
    return inject(ServiceTypeService)
      .find(id)
      .pipe(
        mergeMap((serviceType: HttpResponse<ServiceType>) => {
          if (serviceType.body) {
            return of(serviceType.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default serviceTypeResolve;
