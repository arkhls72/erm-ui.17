import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { PlanNote } from '../plan-note.model';
import { PlanNoteService } from '../service/plan-note.service';

export const planNoteResolve = (route: ActivatedRouteSnapshot): Observable<null | PlanNote> => {
  const id = route.params['id'];
  if (id) {
    return inject(PlanNoteService)
      .find(id)
      .pipe(
        mergeMap((planNote: HttpResponse<PlanNote>) => {
          if (planNote.body) {
            return of(planNote.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default planNoteResolve;
