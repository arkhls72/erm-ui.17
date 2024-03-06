import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ProgExerGroup } from '../prog-exer-group.model';
import { ProgExerGroupService } from '../service/prog-exer-group.service';

export const progExerGroupResolve = (route: ActivatedRouteSnapshot): Observable<null | ProgExerGroup> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProgExerGroupService)
      .find(id)
      .pipe(
        mergeMap((progExerGroup: HttpResponse<ProgExerGroup>) => {
          if (progExerGroup.body) {
            return of(progExerGroup.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default progExerGroupResolve;
