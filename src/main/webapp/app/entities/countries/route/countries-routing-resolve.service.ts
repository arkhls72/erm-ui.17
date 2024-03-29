import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Countries } from '../countries.model';
import { CountriesService } from '../service/countries.service';

export const countriesResolve = (route: ActivatedRouteSnapshot): Observable<null | Countries> => {
  const id = route.params['id'];
  if (id) {
    return inject(CountriesService)
      .find(id)
      .pipe(
        mergeMap((countries: HttpResponse<Countries>) => {
          if (countries.body) {
            return of(countries.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default countriesResolve;
