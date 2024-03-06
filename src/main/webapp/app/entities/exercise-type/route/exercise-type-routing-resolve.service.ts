import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ExerciseType } from '../exercise-type.model';
import { ExerciseTypeService } from '../service/exercise-type.service';

export const exerciseTypeResolve = (route: ActivatedRouteSnapshot): Observable<null | ExerciseType> => {
  const id = route.params['id'];
  if (id) {
    return inject(ExerciseTypeService)
      .find(id)
      .pipe(
        mergeMap((exerciseType: HttpResponse<ExerciseType>) => {
          if (exerciseType.body) {
            return of(exerciseType.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default exerciseTypeResolve;
