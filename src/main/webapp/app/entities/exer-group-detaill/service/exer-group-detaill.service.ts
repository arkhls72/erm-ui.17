import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ExerGroupDetaill, NewExerGroupDetaill } from '../exer-group-detaill.model';
import { ExerGroupDetailWrapper } from '../exer-group-detail-wrapper.model';

export type PartialUpdateExerGroupDetaill = Partial<ExerGroupDetaill> & Pick<ExerGroupDetaill, 'id'>;

type RestOf<T extends ExerGroupDetaill | NewExerGroupDetaill> = Omit<T, 'lastModifiedDate' | 'createdDate'> & {
  lastModifiedDate?: string | null;
  createdDate?: string | null;
};

export type RestExerGroupDetaill = RestOf<ExerGroupDetaill>;

export type NewRestExerGroupDetaill = RestOf<NewExerGroupDetaill>;

export type PartialUpdateRestExerGroupDetaill = RestOf<PartialUpdateExerGroupDetaill>;

export type EntityResponseType = HttpResponse<ExerGroupDetaill>;
export type EntityArrayResponseType = HttpResponse<ExerGroupDetaill[]>;
type EntityGroupResponseType = HttpResponse<ExerGroupDetailWrapper>;
@Injectable({ providedIn: 'root' })
export class ExerGroupDetaillService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/exer-group-detaills');
  public resourceGroupUrl = this.resourceUrl + '/group';
  public resourceProgUrl = this.resourceUrl + '/prog';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(exerGroupDetaill: ExerGroupDetaill): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exerGroupDetaill);
    return this.http
      .post<RestExerGroupDetaill>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(exerGroupDetaill: ExerGroupDetaill): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exerGroupDetaill);
    return this.http
      .put<RestExerGroupDetaill>(`${this.resourceUrl}/${this.getExerGroupDetaillIdentifier(exerGroupDetaill)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(exerGroupDetaill: PartialUpdateExerGroupDetaill): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exerGroupDetaill);
    return this.http
      .patch<RestExerGroupDetaill>(`${this.resourceUrl}/${this.getExerGroupDetaillIdentifier(exerGroupDetaill)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestExerGroupDetaill>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestExerGroupDetaill[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExerGroupDetaillIdentifier(exerGroupDetaill: Pick<ExerGroupDetaill, 'id'>): number {
    return <number>exerGroupDetaill.id;
  }

  compareExerGroupDetaill(o1: Pick<ExerGroupDetaill, 'id'> | null, o2: Pick<ExerGroupDetaill, 'id'> | null): boolean {
    return o1 && o2 ? this.getExerGroupDetaillIdentifier(o1) === this.getExerGroupDetaillIdentifier(o2) : o1 === o2;
  }

  addExerGroupDetaillToCollectionIfMissing<Type extends Pick<ExerGroupDetaill, 'id'>>(
    exerGroupDetaillCollection: Type[],
    ...exerGroupDetaillsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const exerGroupDetaills: Type[] = exerGroupDetaillsToCheck.filter(isPresent);
    if (exerGroupDetaills.length > 0) {
      const exerGroupDetaillCollectionIdentifiers = exerGroupDetaillCollection.map(
        exerGroupDetaillItem => this.getExerGroupDetaillIdentifier(exerGroupDetaillItem)!,
      );
      const exerGroupDetaillsToAdd = exerGroupDetaills.filter(exerGroupDetaillItem => {
        const exerGroupDetaillIdentifier = this.getExerGroupDetaillIdentifier(exerGroupDetaillItem);
        if (exerGroupDetaillCollectionIdentifiers.includes(exerGroupDetaillIdentifier)) {
          return false;
        }
        exerGroupDetaillCollectionIdentifiers.push(exerGroupDetaillIdentifier);
        return true;
      });
      return [...exerGroupDetaillsToAdd, ...exerGroupDetaillCollection];
    }
    return exerGroupDetaillCollection;
  }

  protected convertDateFromClient<T extends ExerGroupDetaill | NewExerGroupDetaill | PartialUpdateExerGroupDetaill>(
    exerGroupDetaill: T,
  ): RestOf<T> {
    return {
      ...exerGroupDetaill,
      lastModifiedDate: exerGroupDetaill.lastModifiedDate?.toJSON() ?? null,
      createdDate: exerGroupDetaill.createdDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restExerGroupDetaill: RestExerGroupDetaill | ExerGroupDetaill): ExerGroupDetaill {
    return {
      ...restExerGroupDetaill,
      lastModifiedDate: restExerGroupDetaill.lastModifiedDate ? dayjs(restExerGroupDetaill.lastModifiedDate) : undefined,
      createdDate: restExerGroupDetaill.createdDate ? dayjs(restExerGroupDetaill.createdDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestExerGroupDetaill>): HttpResponse<ExerGroupDetaill> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestExerGroupDetaill[]>): HttpResponse<ExerGroupDetaill[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /****************************************
   * ERM.2
   */

  // calls to get groups
  findMapExerciseByGroupId(id?: number): Observable<EntityGroupResponseType> {
    return this.http
      .get<ExerGroupDetailWrapper>(`${this.resourceGroupUrl}/${id}/exercise`, { observe: 'response' })
      .pipe(map((res: EntityGroupResponseType) => res));
  }
  updateExerciseByGroupId(exerGroupDetailWrapper: ExerGroupDetailWrapper): Observable<EntityResponseType> {
    const id = exerGroupDetailWrapper.exerGroupId;
    return this.http
      .put<RestExerGroupDetaill>(`${this.resourceGroupUrl}/${id}/exercise`, exerGroupDetailWrapper, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  deleteExerciseByGroupId(id: number, exerciseId: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/group/${id}/exercise/${exerciseId}`, { observe: 'response' });
  }
}
