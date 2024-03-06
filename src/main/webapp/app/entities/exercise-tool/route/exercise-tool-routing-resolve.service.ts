import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ExerciseTool } from '../exercise-tool.model';
import { ExerciseToolService } from '../service/exercise-tool.service';

export const exerciseToolResolve = (route: ActivatedRouteSnapshot): Observable<null | ExerciseTool> => {
  const id = route.params['id'];
  if (id) {
    return inject(ExerciseToolService)
      .find(id)
      .pipe(
        mergeMap((exerciseTool: HttpResponse<ExerciseTool>) => {
          if (exerciseTool.body) {
            return of(exerciseTool.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default exerciseToolResolve;
