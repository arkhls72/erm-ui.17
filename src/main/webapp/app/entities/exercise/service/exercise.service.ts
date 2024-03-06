import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Exercise, NewExercise } from '../exercise.model';
import { ExerciseDetail } from '../detail/exercise-detail-model';
import { ExerciseMedia } from '../exercise-media.model';
import { GroupExerciseMediaWrapper } from '../group-exercise-media-wraper.model';
import { GroupExerciseMedia } from '../group-exercise-media.model';
import { ExerciseMediaWrapper } from '../exercise-media-wraper.model';
import { ProgExerciseInstruction } from '../../prog-exercise-instruction/prog-exercise-instruction.model';

export type PartialUpdateExercise = Partial<Exercise> & Pick<Exercise, 'id'>;

type RestOf<T extends Exercise | NewExercise> = Omit<T, 'lastModifiedDate' | 'createdDate'> & {
  lastModifiedDate?: string | null;
  createdDate?: string | null;
};

export type RestExercise = RestOf<Exercise>;

export type NewRestExercise = RestOf<NewExercise>;

export type PartialUpdateRestExercise = RestOf<PartialUpdateExercise>;

export type EntityResponseType = HttpResponse<Exercise>;
export type EntityArrayResponseType = HttpResponse<Exercise[]>;
export type EntityDetailResponseType = HttpResponse<ExerciseDetail>;
export type EntityMediaResponseType = HttpResponse<ExerciseMedia>;
export type EntityGroupMediaWraperResponseType = HttpResponse<GroupExerciseMediaWrapper>;
type EntityMediaWraperResponseType = HttpResponse<ExerciseMediaWrapper>;

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/exercises');
  private resourceDetailUrl = this.resourceUrl + '/detail';

  private resourceSearchSummaryUrl = this.resourceUrl + '/summary/search';
  private resourceSummaryByExerciseIds = this.resourceUrl + '/summary/ids';
  private resourceSearchSummaryByGroupIdUrl = this.resourceUrl + '/summary/group';
  private resourceSearchSummaryGroupByProgIdUrl = this.resourceUrl + '/summary/group/prog';
  private resourceSearchSummaryByProgIdUrl = this.resourceUrl + '/summary/prog';
  private resourceSummaryUrl = this.resourceUrl + '/summary';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(exercise: Exercise): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exercise);
    return this.http
      .post<RestExercise>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(exercise: Exercise): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exercise);
    return this.http
      .put<RestExercise>(`${this.resourceUrl}/${this.getExerciseIdentifier(exercise)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(exercise: PartialUpdateExercise): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exercise);
    return this.http
      .patch<RestExercise>(`${this.resourceUrl}/${this.getExerciseIdentifier(exercise)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestExercise>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestExercise[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExerciseIdentifier(exercise: Pick<Exercise, 'id'>): number {
    return <number>exercise.id;
  }

  compareExercise(o1: Pick<Exercise, 'id'> | null, o2: Pick<Exercise, 'id'> | null): boolean {
    return o1 && o2 ? this.getExerciseIdentifier(o1) === this.getExerciseIdentifier(o2) : o1 === o2;
  }

  addExerciseToCollectionIfMissing<Type extends Pick<Exercise, 'id'>>(
    exerciseCollection: Type[],
    ...exercisesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const exercises: Type[] = exercisesToCheck.filter(isPresent);
    if (exercises.length > 0) {
      const exerciseCollectionIdentifiers = exerciseCollection.map(exerciseItem => this.getExerciseIdentifier(exerciseItem)!);
      const exercisesToAdd = exercises.filter(exerciseItem => {
        const exerciseIdentifier = this.getExerciseIdentifier(exerciseItem);
        if (exerciseCollectionIdentifiers.includes(exerciseIdentifier)) {
          return false;
        }
        exerciseCollectionIdentifiers.push(exerciseIdentifier);
        return true;
      });
      return [...exercisesToAdd, ...exerciseCollection];
    }
    return exerciseCollection;
  }

  protected convertDateFromClient<T extends Exercise | NewExercise | PartialUpdateExercise>(exercise: T): RestOf<T> {
    const lastModifiedDate = exercise.lastModifiedDate?.toJSON() ?? null;
    return {
      ...exercise,
      lastModifiedDate: exercise.lastModifiedDate?.toJSON() ?? null,
      createdDate: exercise.createdDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restExercise: RestExercise): Exercise {
    return {
      ...restExercise,
      lastModifiedDate: restExercise.lastModifiedDate ? dayjs(restExercise.lastModifiedDate) : undefined,
      createdDate: restExercise.createdDate ? dayjs(restExercise.createdDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestExercise>): HttpResponse<Exercise> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestExercise[]>): HttpResponse<Exercise[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /****************************************
   * ERm2
   *****************************************/

  findExerciseMedia(id?: number): Observable<EntityResponseType> {
    return this.http.get<Exercise>(`${this.resourceUrl}/${id}/media`, { observe: 'response' });
  }

  findExerciseDetail(req?: any): Observable<EntityDetailResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ExerciseDetail>(this.resourceDetailUrl, { params: options, observe: 'response' });
  }

  searchSummary(req?: any): Observable<EntityMediaResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ExerciseMedia>(this.resourceSearchSummaryUrl, { params: options, observe: 'response' });
  }
  findSummaryMedia(req?: any): Observable<EntityMediaResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ExerciseMedia>(this.resourceSummaryUrl, { params: options, observe: 'response' });
  }

  findSummaryMediaByGroupId(req?: any, id?: number): Observable<EntityMediaResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ExerciseMedia>(`${this.resourceSearchSummaryByGroupIdUrl}/${id}`, { params: options, observe: 'response' });
  }

  findSummaryMediaGroupByProgId(req?: any, id?: number): Observable<EntityGroupMediaWraperResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<GroupExerciseMediaWrapper>(`${this.resourceSearchSummaryGroupByProgIdUrl}/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityGroupMediaWraperResponseType) => this.convertTreeDateArrayFromServer(res)));
  }

  findSummaryMediaByProgId(id?: number): Observable<EntityMediaWraperResponseType> {
    return this.http
      .get<ExerciseMediaWrapper>(`${this.resourceSearchSummaryByProgIdUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityMediaWraperResponseType) => this.convertTreeExerciseDateArrayFromServer(res)));
  }

  findSummaryByIds(req?: any): Observable<EntityMediaResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ExerciseMedia>(`${this.resourceSummaryByExerciseIds}`, { params: options, observe: 'response' });
  }
  protected convertTreeDateArrayFromServer(res: EntityGroupMediaWraperResponseType): EntityGroupMediaWraperResponseType {
    if (res.body && res.body.groupExerciseMedias) {
      res.body.groupExerciseMedias.forEach((gxe: GroupExerciseMedia) => {
        gxe.exerGroup!.lastModifiedDate =
          gxe.exerGroup && gxe.exerGroup.lastModifiedDate ? dayjs(gxe.exerGroup.lastModifiedDate) : undefined;
        if (gxe.exerciseMedia && gxe.exerciseMedia.exercises) {
          gxe.exerciseMedia.exercises.forEach((exercise: Exercise) => {
            exercise.lastModifiedDate = exercise.lastModifiedDate ? dayjs(exercise.lastModifiedDate) : undefined;
          });
        }
      });
    }
    return res;
  }
  protected convertTreeExerciseDateArrayFromServer(res: EntityMediaWraperResponseType): EntityMediaWraperResponseType {
    if (res.body && res.body.progExerciseInstructions) {
      res.body.progExerciseInstructions.forEach((p: ProgExerciseInstruction) => {
        p.lastModifiedDate = p.lastModifiedDate ? dayjs(p.lastModifiedDate) : undefined;
        if (p.instruction) {
          p.instruction.lastModifiedDate = p.instruction.lastModifiedDate ? dayjs(p.instruction.lastModifiedDate) : undefined;
        }
      });
    }
    return res;
  }
}
