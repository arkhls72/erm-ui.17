import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ExerciseLevel } from '../exercise-level.model';
import { ExerciseLevelService } from '../service/exercise-level.service';

export const exerciseLevelResolve = (route: ActivatedRouteSnapshot): Observable<null | ExerciseLevel> => {
  const id = route.params['id'];
  if (id) {
    return inject(ExerciseLevelService)
      .find(id)
      .pipe(
        mergeMap((exerciseLevel: HttpResponse<ExerciseLevel>) => {
          if (exerciseLevel.body) {
            return of(exerciseLevel.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default exerciseLevelResolve;
