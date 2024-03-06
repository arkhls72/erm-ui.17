import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ExerGroup, NewExerGroup } from '../exer-group.model';

export type PartialUpdateExerGroup = Partial<ExerGroup> & Pick<ExerGroup, 'id'>;

type RestOf<T extends ExerGroup | NewExerGroup> = Omit<T, 'lastModifiedDate' | 'createdDate'> & {
  lastModifiedDate?: string | null;
  createdDate?: string | null;
};

export type RestExerGroup = RestOf<ExerGroup>;

export type NewRestExerGroup = RestOf<NewExerGroup>;

export type PartialUpdateRestExerGroup = RestOf<PartialUpdateExerGroup>;

export type EntityResponseType = HttpResponse<ExerGroup>;
export type EntityArrayResponseType = HttpResponse<ExerGroup[]>;

@Injectable({ providedIn: 'root' })
export class ExerGroupService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/exer-groups');
  public resourceUrlSearch = this.resourceUrl + '/search';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(exerGroup: ExerGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exerGroup);
    return this.http
      .post<RestExerGroup>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(exerGroup: ExerGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exerGroup);
    return this.http
      .put<RestExerGroup>(`${this.resourceUrl}/${this.getExerGroupIdentifier(exerGroup)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(exerGroup: PartialUpdateExerGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exerGroup);
    return this.http
      .patch<RestExerGroup>(`${this.resourceUrl}/${this.getExerGroupIdentifier(exerGroup)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestExerGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestExerGroup[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExerGroupIdentifier(exerGroup: Pick<ExerGroup, 'id'>): number {
    return exerGroup.id;
  }

  compareExerGroup(o1: Pick<ExerGroup, 'id'> | null, o2: Pick<ExerGroup, 'id'> | null): boolean {
    return o1 && o2 ? this.getExerGroupIdentifier(o1) === this.getExerGroupIdentifier(o2) : o1 === o2;
  }

  addExerGroupToCollectionIfMissing<Type extends Pick<ExerGroup, 'id'>>(
    exerGroupCollection: Type[],
    ...exerGroupsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const exerGroups: Type[] = exerGroupsToCheck.filter(isPresent);
    if (exerGroups.length > 0) {
      const exerGroupCollectionIdentifiers = exerGroupCollection.map(exerGroupItem => this.getExerGroupIdentifier(exerGroupItem)!);
      const exerGroupsToAdd = exerGroups.filter(exerGroupItem => {
        const exerGroupIdentifier = this.getExerGroupIdentifier(exerGroupItem);
        if (exerGroupCollectionIdentifiers.includes(exerGroupIdentifier)) {
          return false;
        }
        exerGroupCollectionIdentifiers.push(exerGroupIdentifier);
        return true;
      });
      return [...exerGroupsToAdd, ...exerGroupCollection];
    }
    return exerGroupCollection;
  }

  protected convertDateFromClient<T extends ExerGroup | NewExerGroup | PartialUpdateExerGroup>(exerGroup: T): RestOf<T> {
    return {
      ...exerGroup,
      lastModifiedDate: exerGroup.lastModifiedDate?.toJSON() ?? null,
      createdDate: exerGroup.createdDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restExerGroup: RestExerGroup): ExerGroup {
    return {
      ...restExerGroup,
      lastModifiedDate: restExerGroup.lastModifiedDate ? dayjs(restExerGroup.lastModifiedDate) : undefined,
      createdDate: restExerGroup.createdDate ? dayjs(restExerGroup.createdDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestExerGroup>): HttpResponse<ExerGroup> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestExerGroup[]>): HttpResponse<ExerGroup[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERM.2
   */

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ExerGroup[]>(this.resourceUrlSearch, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((exerGroup: ExerGroup) => {
        exerGroup.lastModifiedDate = exerGroup.lastModifiedDate ? dayjs(exerGroup.lastModifiedDate) : undefined;
        exerGroup.createdDate = exerGroup.createdDate ? dayjs(exerGroup.createdDate) : undefined;
      });
    }
    return res;
  }
  queryByProg(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ExerGroup[]>(`${this.resourceUrl}/prog`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
}
