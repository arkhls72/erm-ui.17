import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Therapy } from '../therapy.model';
import { TherapyService } from '../service/therapy.service';

export const therapyResolve = (route: ActivatedRouteSnapshot): Observable<null | Therapy> => {
  const id = route.params['id'];
  if (id) {
    return inject(TherapyService)
      .find(id)
      .pipe(
        mergeMap((therapy: HttpResponse<Therapy>) => {
          if (therapy.body) {
            return of(therapy.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default therapyResolve;
