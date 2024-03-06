import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Injury, NewInjury } from '../injury.model';

export type PartialUpdateInjury = Partial<Injury> & Pick<Injury, 'id'>;

type RestOf<T extends Injury | NewInjury> = Omit<T, 'happenDate' | 'createdDate' | 'lastModifiedDate'> & {
  happenDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestInjury = RestOf<Injury>;

export type NewRestInjury = RestOf<NewInjury>;

export type PartialUpdateRestInjury = RestOf<PartialUpdateInjury>;

export type EntityResponseType = HttpResponse<Injury>;
export type EntityArrayResponseType = HttpResponse<Injury[]>;

@Injectable({ providedIn: 'root' })
export class InjuryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/injuries');
  public resourceClientUrl = this.resourceUrl + '/client';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(injury: NewInjury): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(injury);
    return this.http
      .post<RestInjury>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(injury: Injury): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(injury);
    return this.http
      .put<RestInjury>(`${this.resourceUrl}/${this.getInjuryIdentifier(injury)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(injury: PartialUpdateInjury): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(injury);
    return this.http
      .patch<RestInjury>(`${this.resourceUrl}/${this.getInjuryIdentifier(injury)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInjury>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInjury[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInjuryIdentifier(injury: Pick<Injury, 'id'>): number {
    return injury.id;
  }

  compareInjury(o1: Pick<Injury, 'id'> | null, o2: Pick<Injury, 'id'> | null): boolean {
    return o1 && o2 ? this.getInjuryIdentifier(o1) === this.getInjuryIdentifier(o2) : o1 === o2;
  }

  addInjuryToCollectionIfMissing<Type extends Pick<Injury, 'id'>>(
    injuryCollection: Type[],
    ...injuriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const injuries: Type[] = injuriesToCheck.filter(isPresent);
    if (injuries.length > 0) {
      const injuryCollectionIdentifiers = injuryCollection.map(injuryItem => this.getInjuryIdentifier(injuryItem)!);
      const injuriesToAdd = injuries.filter(injuryItem => {
        const injuryIdentifier = this.getInjuryIdentifier(injuryItem);
        if (injuryCollectionIdentifiers.includes(injuryIdentifier)) {
          return false;
        }
        injuryCollectionIdentifiers.push(injuryIdentifier);
        return true;
      });
      return [...injuriesToAdd, ...injuryCollection];
    }
    return injuryCollection;
  }

  protected convertDateFromClient<T extends Injury | NewInjury | PartialUpdateInjury>(injury: T): RestOf<T> {
    return {
      ...injury,
      happenDate: injury.happenDate?.toJSON() ?? null,
      createdDate: injury.createdDate?.toJSON() ?? null,
      lastModifiedDate: injury.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restInjury: RestInjury | Injury): Injury {
    return {
      ...restInjury,
      happenDate: restInjury.happenDate ? dayjs(restInjury.happenDate) : undefined,
      createdDate: restInjury.createdDate ? dayjs(restInjury.createdDate) : undefined,
      lastModifiedDate: restInjury.lastModifiedDate ? dayjs(restInjury.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestInjury> | HttpResponse<Injury>): HttpResponse<Injury> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestInjury[]>): HttpResponse<Injury[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  findByClientId(id: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<Injury[]>(`${this.resourceClientUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  createForClient(injury: Injury, id: number): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(injury);
    return this.http
      .post<Injury>(`${this.resourceClientUrl}/${id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((injury: Injury) => {
        injury.happenDate = injury.happenDate ? dayjs(injury.happenDate) : undefined;
      });
    }
    return res;
  }
}
