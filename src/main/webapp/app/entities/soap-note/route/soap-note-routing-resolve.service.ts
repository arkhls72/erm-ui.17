import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { SoapNote } from '../soap-note.model';
import { SoapNoteService } from '../service/soap-note.service';

export const soapNoteResolve = (route: ActivatedRouteSnapshot): Observable<null | SoapNote> => {
  const id = route.params['id'];
  if (id) {
    return inject(SoapNoteService)
      .find(id)
      .pipe(
        mergeMap((soapNote: HttpResponse<SoapNote>) => {
          if (soapNote.body) {
            return of(soapNote.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default soapNoteResolve;
