import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ProgExerGroup, NewProgExerGroup } from '../prog-exer-group.model';
import { WrapperProg } from '../../exer-group/wrapper-prog.model';

export type PartialUpdateProgExerGroup = Partial<ProgExerGroup> & Pick<ProgExerGroup, 'id'>;

type RestOf<T extends ProgExerGroup | NewProgExerGroup> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestProgExerGroup = RestOf<ProgExerGroup>;

export type NewRestProgExerGroup = RestOf<NewProgExerGroup>;

export type PartialUpdateRestProgExerGroup = RestOf<PartialUpdateProgExerGroup>;

export type EntityResponseType = HttpResponse<ProgExerGroup>;
export type EntityArrayResponseType = HttpResponse<ProgExerGroup[]>;
type EntityWrapperResponseType = HttpResponse<WrapperProg>;

@Injectable({ providedIn: 'root' })
export class ProgExerGroupService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/prog-exer-groups');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(progExerGroup: NewProgExerGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(progExerGroup);
    return this.http
      .post<RestProgExerGroup>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(progExerGroup: ProgExerGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(progExerGroup);
    return this.http
      .put<RestProgExerGroup>(`${this.resourceUrl}/${this.getProgExerGroupIdentifier(progExerGroup)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(progExerGroup: PartialUpdateProgExerGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(progExerGroup);
    return this.http
      .patch<RestProgExerGroup>(`${this.resourceUrl}/${this.getProgExerGroupIdentifier(progExerGroup)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProgExerGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProgExerGroup[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProgExerGroupIdentifier(progExerGroup: Pick<ProgExerGroup, 'id'>): number {
    return progExerGroup.id;
  }

  compareProgExerGroup(o1: Pick<ProgExerGroup, 'id'> | null, o2: Pick<ProgExerGroup, 'id'> | null): boolean {
    return o1 && o2 ? this.getProgExerGroupIdentifier(o1) === this.getProgExerGroupIdentifier(o2) : o1 === o2;
  }

  addProgExerGroupToCollectionIfMissing<Type extends Pick<ProgExerGroup, 'id'>>(
    progExerGroupCollection: Type[],
    ...progExerGroupsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const progExerGroups: Type[] = progExerGroupsToCheck.filter(isPresent);
    if (progExerGroups.length > 0) {
      const progExerGroupCollectionIdentifiers = progExerGroupCollection.map(
        progExerGroupItem => this.getProgExerGroupIdentifier(progExerGroupItem)!,
      );
      const progExerGroupsToAdd = progExerGroups.filter(progExerGroupItem => {
        const progExerGroupIdentifier = this.getProgExerGroupIdentifier(progExerGroupItem);
        if (progExerGroupCollectionIdentifiers.includes(progExerGroupIdentifier)) {
          return false;
        }
        progExerGroupCollectionIdentifiers.push(progExerGroupIdentifier);
        return true;
      });
      return [...progExerGroupsToAdd, ...progExerGroupCollection];
    }
    return progExerGroupCollection;
  }

  protected convertDateFromClient<T extends ProgExerGroup | NewProgExerGroup | PartialUpdateProgExerGroup>(progExerGroup: T): RestOf<T> {
    return {
      ...progExerGroup,
      createdDate: progExerGroup.createdDate?.toJSON() ?? null,
      lastModifiedDate: progExerGroup.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restProgExerGroup: RestProgExerGroup): ProgExerGroup {
    return {
      ...restProgExerGroup,
      createdDate: restProgExerGroup.createdDate ? dayjs(restProgExerGroup.createdDate) : undefined,
      lastModifiedDate: restProgExerGroup.lastModifiedDate ? dayjs(restProgExerGroup.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProgExerGroup>): HttpResponse<ProgExerGroup> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProgExerGroup[]>): HttpResponse<ProgExerGroup[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERM.2
   */

  findByProgId(id?: number): Observable<EntityWrapperResponseType> {
    return this.http
      .get<WrapperProg>(`${this.resourceUrl}/prog/${id}`, { observe: 'response' })
      .pipe(map((res: EntityWrapperResponseType) => res));
  }

  updateByProg(wrapper: WrapperProg, id?: number): Observable<EntityWrapperResponseType> {
    const copy = wrapper;
    return this.http
      .put<WrapperProg>(`${this.resourceUrl}/prog/${id}`, copy, { observe: 'response' })
      .pipe(map((res: EntityWrapperResponseType) => res));
  }
}
