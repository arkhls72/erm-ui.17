import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Coverage, NewCoverage } from '../coverage.model';

export type PartialUpdateCoverage = Partial<Coverage> & Pick<Coverage, 'id'>;

type RestOf<T extends Coverage | NewCoverage> = Omit<T, 'createdDate'> & {
  createdDate?: string | null;
};

export type RestCoverage = RestOf<Coverage>;

export type NewRestCoverage = RestOf<NewCoverage>;

export type PartialUpdateRestCoverage = RestOf<PartialUpdateCoverage>;

export type EntityResponseType = HttpResponse<Coverage>;
export type EntityArrayResponseType = HttpResponse<Coverage[]>;

@Injectable({ providedIn: 'root' })
export class CoverageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/coverages');
  public resourceUrlEhc = this.resourceUrl + '/ehc';
  public resourceUrlWsib = this.resourceUrl + '/wsib';
  public resourceUrlMva = this.resourceUrl + '/mva';

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(coverage: NewCoverage | Coverage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(coverage);
    return this.http
      .post<RestCoverage>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(coverage: Coverage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(coverage);
    return this.http
      .put<RestCoverage>(`${this.resourceUrl}/${this.getCoverageIdentifier(coverage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(coverage: PartialUpdateCoverage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(coverage);
    return this.http
      .patch<RestCoverage>(`${this.resourceUrl}/${this.getCoverageIdentifier(coverage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCoverage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCoverage[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCoverageIdentifier(coverage: Pick<Coverage, 'id'>): number {
    return <number>coverage.id;
  }

  compareCoverage(o1: Pick<Coverage, 'id'> | null, o2: Pick<Coverage, 'id'> | null): boolean {
    return o1 && o2 ? this.getCoverageIdentifier(o1) === this.getCoverageIdentifier(o2) : o1 === o2;
  }

  addCoverageToCollectionIfMissing<Type extends Pick<Coverage, 'id'>>(
    coverageCollection: Type[],
    ...coveragesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const coverages: Type[] = coveragesToCheck.filter(isPresent);
    if (coverages.length > 0) {
      const coverageCollectionIdentifiers = coverageCollection.map(coverageItem => this.getCoverageIdentifier(coverageItem)!);
      const coveragesToAdd = coverages.filter(coverageItem => {
        const coverageIdentifier = this.getCoverageIdentifier(coverageItem);
        if (coverageCollectionIdentifiers.includes(coverageIdentifier)) {
          return false;
        }
        coverageCollectionIdentifiers.push(coverageIdentifier);
        return true;
      });
      return [...coveragesToAdd, ...coverageCollection];
    }
    return coverageCollection;
  }

  protected convertDateFromClient<T extends Coverage | NewCoverage | PartialUpdateCoverage>(coverage: T): RestOf<T> {
    return {
      ...coverage,
      createdDate: coverage.createdDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCoverage: RestCoverage | Coverage): Coverage {
    return {
      ...restCoverage,
      createdDate: restCoverage.createdDate ? dayjs(restCoverage.createdDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCoverage>): HttpResponse<Coverage> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCoverage[]> | HttpResponse<Coverage[]>): HttpResponse<Coverage[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERM.2
   *
   */
  queryByWsib(id: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<Coverage[]>(`${this.resourceUrlWsib}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }
  createOrUpdateMva(coverages: Coverage[], id: number): Observable<EntityArrayResponseType> {
    const array: Coverage[] = [];
    if (coverages !== null && coverages !== undefined && coverages.length > 0) {
      for (let i = 0; i < coverages.length; i++) {
        const copy = <Coverage>this.convertDateFromClient(coverages[i]);
        array.push(copy);
      }
    }
    return this.http
      .put<Coverage[]>(`${this.resourceUrlMva}/${id}`, array, { observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  createOrUpdateWsib(coverages: Coverage[], id: number): Observable<EntityArrayResponseType> {
    const array = [];
    if (coverages !== null && coverages !== undefined && coverages.length > 0) {
      for (let i = 0; i < coverages.length; i++) {
        const copy = this.convertDateFromClient(coverages[i]);
        array.push(copy);
      }
    }
    return this.http
      .post<Coverage[]>(`${this.resourceUrlWsib}/${id}`, array, { observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  createOrUpdateEhc(coverages: Coverage[], id: number): Observable<EntityArrayResponseType> {
    const array = [];
    if (coverages !== null && coverages !== undefined && coverages.length > 0) {
      for (let i = 0; i < coverages.length; i++) {
        const copy = this.convertDateFromClient(coverages[i]);
        array.push(copy);
      }
    }
    return this.http
      .post<Coverage[]>(`${this.resourceUrlEhc}/${id}`, array, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertResponseArrayFromServer(res)));
  }
  queryByMva(id: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<Coverage[]>(`${this.resourceUrlMva}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }
  queryByEhc(id: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<Coverage[]>(`${this.resourceUrlEhc}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }
}
