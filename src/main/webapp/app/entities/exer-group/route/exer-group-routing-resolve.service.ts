import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ExerGroup } from '../exer-group.model';
import { ExerGroupService } from '../service/exer-group.service';

export const exerGroupResolve = (route: ActivatedRouteSnapshot): Observable<null | ExerGroup> => {
  const id = route.params['id'];
  if (id) {
    return inject(ExerGroupService)
      .find(id)
      .pipe(
        mergeMap((exerGroup: HttpResponse<ExerGroup>) => {
          if (exerGroup.body) {
            return of(exerGroup.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default exerGroupResolve;
