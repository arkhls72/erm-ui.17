import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Wsib, NewWsib } from '../wsib.model';

export type PartialUpdateWsib = Partial<Wsib> & Pick<Wsib, 'id'>;

type RestOf<T extends Wsib | NewWsib> = Omit<T, 'accidentDate' | 'closeDate' | 'lastModifiedDate'> & {
  accidentDate?: string | null;
  closeDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestWsib = RestOf<Wsib>;

export type NewRestWsib = RestOf<NewWsib>;

export type PartialUpdateRestWsib = RestOf<PartialUpdateWsib>;

export type EntityResponseType = HttpResponse<Wsib>;
export type EntityArrayResponseType = HttpResponse<Wsib[]>;

@Injectable({ providedIn: 'root' })
export class WsibService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/wsibs');
  public resourceUrlClient = this.resourceUrl + '/client';

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(wsib: NewWsib): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(wsib);
    return this.http.post<RestWsib>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(wsib: Wsib): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(wsib);
    return this.http
      .put<RestWsib>(`${this.resourceUrl}/${this.getWsibIdentifier(wsib)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(wsib: PartialUpdateWsib): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(wsib);
    return this.http
      .patch<RestWsib>(`${this.resourceUrl}/${this.getWsibIdentifier(wsib)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestWsib>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestWsib[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getWsibIdentifier(wsib: Pick<Wsib, 'id'>): number {
    return <number>wsib.id;
  }

  compareWsib(o1: Pick<Wsib, 'id'> | null, o2: Pick<Wsib, 'id'> | null): boolean {
    return o1 && o2 ? this.getWsibIdentifier(o1) === this.getWsibIdentifier(o2) : o1 === o2;
  }

  addWsibToCollectionIfMissing<Type extends Pick<Wsib, 'id'>>(
    wsibCollection: Type[],
    ...wsibsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const wsibs: Type[] = wsibsToCheck.filter(isPresent);
    if (wsibs.length > 0) {
      const wsibCollectionIdentifiers = wsibCollection.map(wsibItem => this.getWsibIdentifier(wsibItem)!);
      const wsibsToAdd = wsibs.filter(wsibItem => {
        const wsibIdentifier = this.getWsibIdentifier(wsibItem);
        if (wsibCollectionIdentifiers.includes(wsibIdentifier)) {
          return false;
        }
        wsibCollectionIdentifiers.push(wsibIdentifier);
        return true;
      });
      return [...wsibsToAdd, ...wsibCollection];
    }
    return wsibCollection;
  }

  protected convertDateFromClient<T extends Wsib | NewWsib | PartialUpdateWsib>(wsib: T): RestOf<T> {
    return {
      ...wsib,
      accidentDate: wsib.accidentDate?.toJSON() ?? null,
      closeDate: wsib.closeDate?.toJSON() ?? null,
      lastModifiedDate: wsib.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restWsib: RestWsib | Wsib): Wsib {
    return {
      ...restWsib,
      accidentDate: restWsib.accidentDate ? dayjs(restWsib.accidentDate) : undefined,
      closeDate: restWsib.closeDate ? dayjs(restWsib.closeDate) : undefined,
      lastModifiedDate: restWsib.lastModifiedDate ? dayjs(restWsib.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestWsib> | HttpResponse<Wsib>): HttpResponse<Wsib> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestWsib[]>): HttpResponse<Wsib[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERM.2
   */
  createForClient(wsib: Wsib, id?: number): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(wsib);
    return this.http
      .post<Wsib>(`${this.resourceUrlClient}/${id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  queryByClientId(req?: any, id?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Wsib[]>(`${this.resourceUrlClient}/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((wsib: Wsib) => {
        wsib.accidentDate = wsib.accidentDate ? dayjs(wsib.accidentDate) : undefined;
        wsib.closeDate = wsib.closeDate ? dayjs(wsib.closeDate) : undefined;
        wsib.lastModifiedDate = wsib.lastModifiedDate ? dayjs(wsib.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
