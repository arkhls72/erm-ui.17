import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ProgGroupInstruction } from '../prog-group-instruction.model';
import { ProgGroupInstructionService } from '../service/prog-group-instruction.service';

export const progGroupInstructionResolve = (route: ActivatedRouteSnapshot): Observable<null | ProgGroupInstruction> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProgGroupInstructionService)
      .find(id)
      .pipe(
        mergeMap((progGroupInstruction: HttpResponse<ProgGroupInstruction>) => {
          if (progGroupInstruction.body) {
            return of(progGroupInstruction.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default progGroupInstructionResolve;
