import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { EhcClient, NewEhcClient } from '../ehc-client.model';
import { EhcSecondary } from '../../ehc/ehc-secondary.model';

export type PartialUpdateEhcClient = Partial<EhcClient> & Pick<EhcClient, 'id'>;

type RestOf<T extends EhcClient | NewEhcClient> = Omit<T, 'endDate' | 'removedDate' | 'lastModfiedDate' | 'createdDate'> & {
  endDate?: string | null;
  removedDate?: string | null;
  lastModfiedDate?: string | null;
  createdDate?: string | null;
};

export type RestEhcClient = RestOf<EhcClient>;

export type NewRestEhcClient = RestOf<NewEhcClient>;

export type PartialUpdateRestEhcClient = RestOf<PartialUpdateEhcClient>;

export type EntityResponseType = HttpResponse<EhcClient>;
export type EntityArrayResponseType = HttpResponse<EhcClient[]>;

@Injectable({ providedIn: 'root' })
export class EhcClientService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ehc-clients');
  public resourceUrlSecondary = this.resourceUrl + '/secondary';

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(ehcClient: NewEhcClient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ehcClient);
    return this.http
      .post<RestEhcClient>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(ehcClient: EhcClient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ehcClient);
    return this.http
      .put<RestEhcClient>(`${this.resourceUrl}/${this.getEhcClientIdentifier(ehcClient)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(ehcClient: PartialUpdateEhcClient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ehcClient);
    return this.http
      .patch<RestEhcClient>(`${this.resourceUrl}/${this.getEhcClientIdentifier(ehcClient)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEhcClient>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEhcClient[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEhcClientIdentifier(ehcClient: Pick<EhcClient, 'id'>): number {
    return ehcClient.id;
  }

  compareEhcClient(o1: Pick<EhcClient, 'id'> | null, o2: Pick<EhcClient, 'id'> | null): boolean {
    return o1 && o2 ? this.getEhcClientIdentifier(o1) === this.getEhcClientIdentifier(o2) : o1 === o2;
  }

  addEhcClientToCollectionIfMissing<Type extends Pick<EhcClient, 'id'>>(
    ehcClientCollection: Type[],
    ...ehcClientsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ehcClients: Type[] = ehcClientsToCheck.filter(isPresent);
    if (ehcClients.length > 0) {
      const ehcClientCollectionIdentifiers = ehcClientCollection.map(ehcClientItem => this.getEhcClientIdentifier(ehcClientItem)!);
      const ehcClientsToAdd = ehcClients.filter(ehcClientItem => {
        const ehcClientIdentifier = this.getEhcClientIdentifier(ehcClientItem);
        if (ehcClientCollectionIdentifiers.includes(ehcClientIdentifier)) {
          return false;
        }
        ehcClientCollectionIdentifiers.push(ehcClientIdentifier);
        return true;
      });
      return [...ehcClientsToAdd, ...ehcClientCollection];
    }
    return ehcClientCollection;
  }

  protected convertDateFromClient<T extends EhcClient | NewEhcClient | PartialUpdateEhcClient>(ehcClient: T): RestOf<T> {
    return {
      ...ehcClient,
      endDate: ehcClient.endDate?.toJSON() ?? null,
      removedDate: ehcClient.removedDate?.toJSON() ?? null,
      lastModfiedDate: ehcClient.lastModifiedDate?.toJSON() ?? null,
      createdDate: ehcClient.createdDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEhcClient: RestEhcClient): EhcClient {
    return {
      ...restEhcClient,
      endDate: restEhcClient.endDate ? dayjs(restEhcClient.endDate) : undefined,
      removedDate: restEhcClient.removedDate ? dayjs(restEhcClient.removedDate) : undefined,
      lastModifiedDate: restEhcClient.lastModfiedDate ? dayjs(restEhcClient.lastModfiedDate) : undefined,
      createdDate: restEhcClient.createdDate ? dayjs(restEhcClient.createdDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEhcClient>): HttpResponse<EhcClient> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEhcClient[]>): HttpResponse<EhcClient[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERM.2
   */

  createOrDelete(ehcSeconday?: EhcSecondary): Observable<EntityArrayResponseType> {
    const copy = ehcSeconday;
    return this.http
      .post<EhcClient[]>(this.resourceUrlSecondary, copy, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  querySecondaryByClientId(id?: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<EhcClient[]>(`${this.resourceUrlSecondary}/client/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((ehcClient: EhcClient) => {
        ehcClient.createdDate = ehcClient.createdDate ? dayjs(ehcClient.createdDate) : undefined;
        ehcClient.lastModifiedDate = ehcClient.lastModifiedDate ? dayjs(ehcClient.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
