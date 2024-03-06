import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Exercise } from '../exercise.model';
import { ExerciseService } from '../service/exercise.service';

export const exerciseResolve = (route: ActivatedRouteSnapshot): Observable<null | Exercise> => {
  const id = route.params['id'];
  if (id) {
    return inject(ExerciseService)
      .find(id)
      .pipe(
        mergeMap((exercise: HttpResponse<Exercise>) => {
          if (exercise.body) {
            return of(exercise.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default exerciseResolve;
