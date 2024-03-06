import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Mva } from '../mva.model';
import { MvaService } from '../service/mva.service';

export const mvaResolve = (route: ActivatedRouteSnapshot): Observable<null | Mva> => {
  const id = route.params['id'];
  if (id) {
    return inject(MvaService)
      .find(id)
      .pipe(
        mergeMap((mva: HttpResponse<Mva>) => {
          if (mva.body) {
            return of(mva.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default mvaResolve;
