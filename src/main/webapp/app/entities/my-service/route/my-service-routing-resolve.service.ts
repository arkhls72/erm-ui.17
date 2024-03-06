import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { MyService } from '../my-service.model';
import { MyServiceService } from '../service/my-service.service';

export const myServiceResolve = (route: ActivatedRouteSnapshot): Observable<null | MyService> => {
  const id = route.params['id'];
  if (id) {
    return inject(MyServiceService)
      .find(id)
      .pipe(
        mergeMap((myService: HttpResponse<MyService>) => {
          if (myService.body) {
            return of(myService.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default myServiceResolve;
