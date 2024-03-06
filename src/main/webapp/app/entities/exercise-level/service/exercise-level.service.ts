import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ExerciseLevel, NewExerciseLevel } from '../exercise-level.model';

export type PartialUpdateExerciseLevel = Partial<ExerciseLevel> & Pick<ExerciseLevel, 'id'>;

export type EntityResponseType = HttpResponse<ExerciseLevel>;
export type EntityArrayResponseType = HttpResponse<ExerciseLevel[]>;

@Injectable({ providedIn: 'root' })
export class ExerciseLevelService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/exercise-levels');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(exerciseLevel: NewExerciseLevel): Observable<EntityResponseType> {
    return this.http.post<ExerciseLevel>(this.resourceUrl, exerciseLevel, { observe: 'response' });
  }

  update(exerciseLevel: ExerciseLevel): Observable<EntityResponseType> {
    return this.http.put<ExerciseLevel>(`${this.resourceUrl}/${this.getExerciseLevelIdentifier(exerciseLevel)}`, exerciseLevel, {
      observe: 'response',
    });
  }

  partialUpdate(exerciseLevel: PartialUpdateExerciseLevel): Observable<EntityResponseType> {
    return this.http.patch<ExerciseLevel>(`${this.resourceUrl}/${this.getExerciseLevelIdentifier(exerciseLevel)}`, exerciseLevel, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ExerciseLevel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ExerciseLevel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExerciseLevelIdentifier(exerciseLevel: Pick<ExerciseLevel, 'id'>): number {
    return exerciseLevel.id;
  }

  compareExerciseLevel(o1: Pick<ExerciseLevel, 'id'> | null, o2: Pick<ExerciseLevel, 'id'> | null): boolean {
    return o1 && o2 ? this.getExerciseLevelIdentifier(o1) === this.getExerciseLevelIdentifier(o2) : o1 === o2;
  }

  addExerciseLevelToCollectionIfMissing<Type extends Pick<ExerciseLevel, 'id'>>(
    exerciseLevelCollection: Type[],
    ...exerciseLevelsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const exerciseLevels: Type[] = exerciseLevelsToCheck.filter(isPresent);
    if (exerciseLevels.length > 0) {
      const exerciseLevelCollectionIdentifiers = exerciseLevelCollection.map(
        exerciseLevelItem => this.getExerciseLevelIdentifier(exerciseLevelItem)!,
      );
      const exerciseLevelsToAdd = exerciseLevels.filter(exerciseLevelItem => {
        const exerciseLevelIdentifier = this.getExerciseLevelIdentifier(exerciseLevelItem);
        if (exerciseLevelCollectionIdentifiers.includes(exerciseLevelIdentifier)) {
          return false;
        }
        exerciseLevelCollectionIdentifiers.push(exerciseLevelIdentifier);
        return true;
      });
      return [...exerciseLevelsToAdd, ...exerciseLevelCollection];
    }
    return exerciseLevelCollection;
  }
}
