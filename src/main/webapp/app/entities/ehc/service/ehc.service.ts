import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Ehc, NewEhc } from '../ehc.model';
import { EhcEdit } from '../ehc-edit.model';
import { DATE_FORMAT } from '../../../config/input.constants';

export type PartialUpdateEhc = Partial<Ehc> & Pick<Ehc, 'id'>;

type RestOf<T extends Ehc | NewEhc> = Omit<T, 'endDate' | 'createdDate' | 'lastModifiedDate'> & {
  endDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestEhc = RestOf<Ehc>;

export type NewRestEhc = RestOf<NewEhc>;

export type PartialUpdateRestEhc = RestOf<PartialUpdateEhc>;

export type EntityResponseType = HttpResponse<Ehc>;
export type EntityArrayResponseType = HttpResponse<Ehc[]>;
type EntityEditResponseType = HttpResponse<EhcEdit>;

@Injectable({ providedIn: 'root' })
export class EhcService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ehcs');
  public resourceUrlClient = this.resourceUrl + '/client';

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(ehc: NewEhc): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ehc);
    return this.http.post<RestEhc>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(ehc: Ehc): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ehc);
    return this.http
      .put<RestEhc>(`${this.resourceUrl}/${this.getEhcIdentifier(ehc)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(ehc: PartialUpdateEhc): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ehc);
    return this.http
      .patch<RestEhc>(`${this.resourceUrl}/${this.getEhcIdentifier(ehc)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEhc>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEhc[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEhcIdentifier(ehc: Pick<Ehc, 'id'>): number {
    return ehc.id;
  }

  compareEhc(o1: Pick<Ehc, 'id'> | null, o2: Pick<Ehc, 'id'> | null): boolean {
    return o1 && o2 ? this.getEhcIdentifier(o1) === this.getEhcIdentifier(o2) : o1 === o2;
  }

  addEhcToCollectionIfMissing<Type extends Pick<Ehc, 'id'>>(ehcCollection: Type[], ...ehcsToCheck: (Type | null | undefined)[]): Type[] {
    const ehcs: Type[] = ehcsToCheck.filter(isPresent);
    if (ehcs.length > 0) {
      const ehcCollectionIdentifiers = ehcCollection.map(ehcItem => this.getEhcIdentifier(ehcItem)!);
      const ehcsToAdd = ehcs.filter(ehcItem => {
        const ehcIdentifier = this.getEhcIdentifier(ehcItem);
        if (ehcCollectionIdentifiers.includes(ehcIdentifier)) {
          return false;
        }
        ehcCollectionIdentifiers.push(ehcIdentifier);
        return true;
      });
      return [...ehcsToAdd, ...ehcCollection];
    }
    return ehcCollection;
  }

  protected convertDateFromClient<T extends Ehc | NewEhc | PartialUpdateEhc>(ehc: T): RestOf<T> {
    return {
      ...ehc,
      endDate: ehc.endDate?.toJSON() ?? null,
      createdDate: ehc.createdDate?.toJSON() ?? null,
      lastModifiedDate: ehc.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEhc: RestEhc): Ehc {
    return {
      ...restEhc,
      endDate: restEhc.endDate ? dayjs(restEhc.endDate) : undefined,
      createdDate: restEhc.createdDate ? dayjs(restEhc.createdDate) : undefined,
      lastModifiedDate: restEhc.lastModifiedDate ? dayjs(restEhc.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEhc>): HttpResponse<Ehc> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEhc[]>): HttpResponse<Ehc[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERM.2
   */

  createForClient(ehc: Ehc, id?: number): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ehc);
    return this.http.post<Ehc>(`${this.resourceUrlClient}/${id}`, copy, { observe: 'response' });
    return this.http.post<RestEhc>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }
  getForEdit(id?: number): Observable<EntityEditResponseType> {
    return this.http
      .get<EhcEdit>(`${this.resourceUrl}/${id}/edit`, { observe: 'response' })
      .pipe(map(res => this.convertDateFromServerEdit(res)));
  }

  findByClientPageable(req?: any, id?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Ehc[]>(`${this.resourceUrlClient}/${id}/pageable`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  updateWithDependent(ehcEdit: EhcEdit): Observable<EntityEditResponseType> {
    const copy = this.convertDateFromClientEdit(ehcEdit);
    return this.http
      .put<EhcEdit>(`${this.resourceUrl}/edit`, copy, { observe: 'response' })
      .pipe(map((res: EntityEditResponseType) => this.convertDateFromServerEdit(res)));
  }
  protected convertDateFromClientEdit(ehcEdit: EhcEdit): EhcEdit {
    const copy: EhcEdit = Object.assign({}, ehcEdit, {
      endDate:
        ehcEdit.primary && ehcEdit.primary.endDate && ehcEdit.primary.endDate.isValid()
          ? ehcEdit.primary.endDate.format(DATE_FORMAT)
          : null,
    });
    return copy;
  }
  protected convertDateFromServerEdit(res: EntityEditResponseType): EntityEditResponseType {
    if (res.body && res.body.primary) {
      res.body.primary.endDate = res.body.primary.endDate ? dayjs(res.body.primary.endDate) : undefined;
      res.body.primary.createdDate = res.body.primary.createdDate ? dayjs(res.body.primary.createdDate) : undefined;
      res.body.primary.lastModifiedDate = res.body.primary.lastModifiedDate ? dayjs(res.body.primary.lastModifiedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((ehc: Ehc) => {
        ehc.endDate = ehc.endDate ? dayjs(ehc.endDate) : undefined;
        ehc.createdDate = ehc.lastModifiedDate ? dayjs(ehc.createdDate) : undefined;
        ehc.lastModifiedDate = ehc.lastModifiedDate ? dayjs(ehc.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
