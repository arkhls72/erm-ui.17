import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Mva, NewMva } from '../mva.model';

export type PartialUpdateMva = Partial<Mva> & Pick<Mva, 'id'>;

type RestOf<T extends Mva | NewMva> = Omit<T, 'accidentDate' | 'closeDate' | 'createdDate' | 'lastModifiedDate'> & {
  accidentDate?: string | null;
  closeDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestMva = RestOf<Mva>;

export type NewRestMva = RestOf<NewMva>;

export type PartialUpdateRestMva = RestOf<PartialUpdateMva>;

export type EntityResponseType = HttpResponse<Mva>;
export type EntityArrayResponseType = HttpResponse<Mva[]>;

@Injectable({ providedIn: 'root' })
export class MvaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mvas');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(mva: NewMva | Mva): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mva);
    return this.http.post<RestMva>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(mva: Mva): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mva);
    return this.http
      .put<RestMva>(`${this.resourceUrl}/${this.getMvaIdentifier(mva)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(mva: PartialUpdateMva): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mva);
    return this.http
      .patch<RestMva>(`${this.resourceUrl}/${this.getMvaIdentifier(mva)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMva>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMva[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMvaIdentifier(mva: Pick<Mva, 'id'>): number {
    return mva.id;
  }

  compareMva(o1: Pick<Mva, 'id'> | null, o2: Pick<Mva, 'id'> | null): boolean {
    return o1 && o2 ? this.getMvaIdentifier(o1) === this.getMvaIdentifier(o2) : o1 === o2;
  }

  addMvaToCollectionIfMissing<Type extends Pick<Mva, 'id'>>(mvaCollection: Type[], ...mvasToCheck: (Type | null | undefined)[]): Type[] {
    const mvas: Type[] = mvasToCheck.filter(isPresent);
    if (mvas.length > 0) {
      const mvaCollectionIdentifiers = mvaCollection.map(mvaItem => this.getMvaIdentifier(mvaItem)!);
      const mvasToAdd = mvas.filter(mvaItem => {
        const mvaIdentifier = this.getMvaIdentifier(mvaItem);
        if (mvaCollectionIdentifiers.includes(mvaIdentifier)) {
          return false;
        }
        mvaCollectionIdentifiers.push(mvaIdentifier);
        return true;
      });
      return [...mvasToAdd, ...mvaCollection];
    }
    return mvaCollection;
  }

  protected convertDateFromClient<T extends Mva | NewMva | PartialUpdateMva>(mva: T): RestOf<T> {
    return {
      ...mva,
      accidentDate: mva.accidentDate?.toJSON() ?? null,
      closeDate: mva.closeDate?.toJSON() ?? null,
      createdDate: mva.createdDate?.toJSON() ?? null,
      lastModifiedDate: mva.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restMva: RestMva): Mva {
    return {
      ...restMva,
      accidentDate: restMva.accidentDate ? dayjs(restMva.accidentDate) : undefined,
      closeDate: restMva.closeDate ? dayjs(restMva.closeDate) : undefined,
      createdDate: restMva.createdDate ? dayjs(restMva.createdDate) : undefined,
      lastModifiedDate: restMva.lastModifiedDate ? dayjs(restMva.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMva>): HttpResponse<Mva> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMva[]>): HttpResponse<Mva[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
