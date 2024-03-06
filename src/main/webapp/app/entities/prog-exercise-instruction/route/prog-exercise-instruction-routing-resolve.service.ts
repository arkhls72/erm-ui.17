import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ProgExerciseInstruction } from '../prog-exercise-instruction.model';
import { ProgExerciseInstructionService } from '../service/prog-exercise-instruction.service';

export const progExerciseInstructionResolve = (route: ActivatedRouteSnapshot): Observable<null | ProgExerciseInstruction> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProgExerciseInstructionService)
      .find(id)
      .pipe(
        mergeMap((progExerciseInstruction: HttpResponse<ProgExerciseInstruction>) => {
          if (progExerciseInstruction.body) {
            return of(progExerciseInstruction.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default progExerciseInstructionResolve;
