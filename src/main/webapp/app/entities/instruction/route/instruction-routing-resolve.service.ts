import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Instruction } from '../instruction.model';
import { InstructionService } from '../service/instruction.service';

export const instructionResolve = (route: ActivatedRouteSnapshot): Observable<null | Instruction> => {
  const id = route.params['id'];
  if (id) {
    return inject(InstructionService)
      .find(id)
      .pipe(
        mergeMap((instruction: HttpResponse<Instruction>) => {
          if (instruction.body) {
            return of(instruction.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default instructionResolve;
