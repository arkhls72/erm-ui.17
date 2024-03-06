import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ExerciseTool, NewExerciseTool } from '../exercise-tool.model';

export type PartialUpdateExerciseTool = Partial<ExerciseTool> & Pick<ExerciseTool, 'id'>;

export type EntityResponseType = HttpResponse<ExerciseTool>;
export type EntityArrayResponseType = HttpResponse<ExerciseTool[]>;

@Injectable({ providedIn: 'root' })
export class ExerciseToolService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/exercise-tools');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(exerciseTool: NewExerciseTool): Observable<EntityResponseType> {
    return this.http.post<ExerciseTool>(this.resourceUrl, exerciseTool, { observe: 'response' });
  }

  update(exerciseTool: ExerciseTool): Observable<EntityResponseType> {
    return this.http.put<ExerciseTool>(`${this.resourceUrl}/${this.getExerciseToolIdentifier(exerciseTool)}`, exerciseTool, {
      observe: 'response',
    });
  }

  partialUpdate(exerciseTool: PartialUpdateExerciseTool): Observable<EntityResponseType> {
    return this.http.patch<ExerciseTool>(`${this.resourceUrl}/${this.getExerciseToolIdentifier(exerciseTool)}`, exerciseTool, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ExerciseTool>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ExerciseTool[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExerciseToolIdentifier(exerciseTool: Pick<ExerciseTool, 'id'>): number {
    return exerciseTool.id;
  }

  compareExerciseTool(o1: Pick<ExerciseTool, 'id'> | null, o2: Pick<ExerciseTool, 'id'> | null): boolean {
    return o1 && o2 ? this.getExerciseToolIdentifier(o1) === this.getExerciseToolIdentifier(o2) : o1 === o2;
  }

  addExerciseToolToCollectionIfMissing<Type extends Pick<ExerciseTool, 'id'>>(
    exerciseToolCollection: Type[],
    ...exerciseToolsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const exerciseTools: Type[] = exerciseToolsToCheck.filter(isPresent);
    if (exerciseTools.length > 0) {
      const exerciseToolCollectionIdentifiers = exerciseToolCollection.map(
        exerciseToolItem => this.getExerciseToolIdentifier(exerciseToolItem)!,
      );
      const exerciseToolsToAdd = exerciseTools.filter(exerciseToolItem => {
        const exerciseToolIdentifier = this.getExerciseToolIdentifier(exerciseToolItem);
        if (exerciseToolCollectionIdentifiers.includes(exerciseToolIdentifier)) {
          return false;
        }
        exerciseToolCollectionIdentifiers.push(exerciseToolIdentifier);
        return true;
      });
      return [...exerciseToolsToAdd, ...exerciseToolCollection];
    }
    return exerciseToolCollection;
  }
}
