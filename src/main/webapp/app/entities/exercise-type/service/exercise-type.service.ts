import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ExerciseType, NewExerciseType } from '../exercise-type.model';

export type PartialUpdateExerciseType = Partial<ExerciseType> & Pick<ExerciseType, 'id'>;

export type EntityResponseType = HttpResponse<ExerciseType>;
export type EntityArrayResponseType = HttpResponse<ExerciseType[]>;

@Injectable({ providedIn: 'root' })
export class ExerciseTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/exercise-types');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(exerciseType: NewExerciseType): Observable<EntityResponseType> {
    return this.http.post<ExerciseType>(this.resourceUrl, exerciseType, { observe: 'response' });
  }

  update(exerciseType: ExerciseType): Observable<EntityResponseType> {
    return this.http.put<ExerciseType>(`${this.resourceUrl}/${this.getExerciseTypeIdentifier(exerciseType)}`, exerciseType, {
      observe: 'response',
    });
  }

  partialUpdate(exerciseType: PartialUpdateExerciseType): Observable<EntityResponseType> {
    return this.http.patch<ExerciseType>(`${this.resourceUrl}/${this.getExerciseTypeIdentifier(exerciseType)}`, exerciseType, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ExerciseType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ExerciseType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExerciseTypeIdentifier(exerciseType: Pick<ExerciseType, 'id'>): number {
    return exerciseType.id;
  }

  compareExerciseType(o1: Pick<ExerciseType, 'id'> | null, o2: Pick<ExerciseType, 'id'> | null): boolean {
    return o1 && o2 ? this.getExerciseTypeIdentifier(o1) === this.getExerciseTypeIdentifier(o2) : o1 === o2;
  }

  addExerciseTypeToCollectionIfMissing<Type extends Pick<ExerciseType, 'id'>>(
    exerciseTypeCollection: Type[],
    ...exerciseTypesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const exerciseTypes: Type[] = exerciseTypesToCheck.filter(isPresent);
    if (exerciseTypes.length > 0) {
      const exerciseTypeCollectionIdentifiers = exerciseTypeCollection.map(
        exerciseTypeItem => this.getExerciseTypeIdentifier(exerciseTypeItem)!,
      );
      const exerciseTypesToAdd = exerciseTypes.filter(exerciseTypeItem => {
        const exerciseTypeIdentifier = this.getExerciseTypeIdentifier(exerciseTypeItem);
        if (exerciseTypeCollectionIdentifiers.includes(exerciseTypeIdentifier)) {
          return false;
        }
        exerciseTypeCollectionIdentifiers.push(exerciseTypeIdentifier);
        return true;
      });
      return [...exerciseTypesToAdd, ...exerciseTypeCollection];
    }
    return exerciseTypeCollection;
  }
}
