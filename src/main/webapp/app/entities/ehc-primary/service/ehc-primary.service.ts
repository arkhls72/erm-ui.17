import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { EhcPrimary, NewEhcPrimary } from '../ehc-primary.model';

export type PartialUpdateEhcPrimary = Partial<EhcPrimary> & Pick<EhcPrimary, 'id'>;

type RestOf<T extends EhcPrimary | NewEhcPrimary> = Omit<T, 'endDate' | 'createdDate' | 'lastModifiedDate'> & {
  endDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestEhcPrimary = RestOf<EhcPrimary>;

export type NewRestEhcPrimary = RestOf<NewEhcPrimary>;

export type PartialUpdateRestEhcPrimary = RestOf<PartialUpdateEhcPrimary>;

export type EntityResponseType = HttpResponse<EhcPrimary>;
export type EntityArrayResponseType = HttpResponse<EhcPrimary[]>;

@Injectable({ providedIn: 'root' })
export class EhcPrimaryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ehc-primaries');
  private resourceSearchUrlPrimary = this.resourceUrl + '/_search';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(ehcPrimary: NewEhcPrimary): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ehcPrimary);
    return this.http
      .post<RestEhcPrimary>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(ehcPrimary: EhcPrimary): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ehcPrimary);
    return this.http
      .put<RestEhcPrimary>(`${this.resourceUrl}/${this.getEhcPrimaryIdentifier(ehcPrimary)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(ehcPrimary: PartialUpdateEhcPrimary): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ehcPrimary);
    return this.http
      .patch<RestEhcPrimary>(`${this.resourceUrl}/${this.getEhcPrimaryIdentifier(ehcPrimary)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEhcPrimary>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEhcPrimary[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEhcPrimaryIdentifier(ehcPrimary: Pick<EhcPrimary, 'id'>): number {
    return ehcPrimary.id;
  }

  compareEhcPrimary(o1: Pick<EhcPrimary, 'id'> | null, o2: Pick<EhcPrimary, 'id'> | null): boolean {
    return o1 && o2 ? this.getEhcPrimaryIdentifier(o1) === this.getEhcPrimaryIdentifier(o2) : o1 === o2;
  }

  addEhcPrimaryToCollectionIfMissing<Type extends Pick<EhcPrimary, 'id'>>(
    ehcPrimaryCollection: Type[],
    ...ehcPrimariesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ehcPrimaries: Type[] = ehcPrimariesToCheck.filter(isPresent);
    if (ehcPrimaries.length > 0) {
      const ehcPrimaryCollectionIdentifiers = ehcPrimaryCollection.map(ehcPrimaryItem => this.getEhcPrimaryIdentifier(ehcPrimaryItem)!);
      const ehcPrimariesToAdd = ehcPrimaries.filter(ehcPrimaryItem => {
        const ehcPrimaryIdentifier = this.getEhcPrimaryIdentifier(ehcPrimaryItem);
        if (ehcPrimaryCollectionIdentifiers.includes(ehcPrimaryIdentifier)) {
          return false;
        }
        ehcPrimaryCollectionIdentifiers.push(ehcPrimaryIdentifier);
        return true;
      });
      return [...ehcPrimariesToAdd, ...ehcPrimaryCollection];
    }
    return ehcPrimaryCollection;
  }

  protected convertDateFromClient<T extends EhcPrimary | NewEhcPrimary | PartialUpdateEhcPrimary>(ehcPrimary: T): RestOf<T> {
    return {
      ...ehcPrimary,
      endDate: ehcPrimary.endDate?.toJSON() ?? null,
      createdDate: ehcPrimary.createdDate?.format(DATE_FORMAT) ?? null,
      lastModifiedDate: ehcPrimary.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEhcPrimary: RestEhcPrimary): EhcPrimary {
    return {
      ...restEhcPrimary,
      endDate: restEhcPrimary.endDate ? dayjs(restEhcPrimary.endDate) : undefined,
      createdDate: restEhcPrimary.createdDate ? dayjs(restEhcPrimary.createdDate) : undefined,
      lastModifiedDate: restEhcPrimary.lastModifiedDate ? dayjs(restEhcPrimary.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEhcPrimary>): HttpResponse<EhcPrimary> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEhcPrimary[]>): HttpResponse<EhcPrimary[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERM.2
   */

  searchPrimaryOtherClient(req?: any, id?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<EhcPrimary[]>(`${this.resourceSearchUrlPrimary}/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  queryPrimaryOtherClient(req?: any, id?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<EhcPrimary[]>(`${this.resourceUrl}/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((ehc: EhcPrimary) => {
        ehc.endDate = ehc.endDate ? dayjs(ehc.endDate) : undefined;
        ehc.lastModifiedDate = ehc.lastModifiedDate ? dayjs(ehc.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
