import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ProgNote } from '../prog-note.model';
import { ProgNoteService } from '../service/prog-note.service';

export const progNoteResolve = (route: ActivatedRouteSnapshot): Observable<null | ProgNote> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProgNoteService)
      .find(id)
      .pipe(
        mergeMap((progNote: HttpResponse<ProgNote>) => {
          if (progNote.body) {
            return of(progNote.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default progNoteResolve;
