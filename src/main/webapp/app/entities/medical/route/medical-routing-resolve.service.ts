import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Medical } from '../medical.model';
import { MedicalService } from '../service/medical.service';

export const medicalResolve = (route: ActivatedRouteSnapshot): Observable<null | Medical> => {
  const id = route.params['id'];
  if (id) {
    return inject(MedicalService)
      .find(id)
      .pipe(
        mergeMap((medical: HttpResponse<Medical>) => {
          if (medical.body) {
            return of(medical.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default medicalResolve;
