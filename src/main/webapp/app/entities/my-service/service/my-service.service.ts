import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MyService, NewMyService } from '../my-service.model';
import { MyServiceDetail } from '../my-service-detail.model';

export type PartialUpdateMyService = Partial<MyService> & Pick<MyService, 'id'>;

type RestOf<T extends MyService | NewMyService> = Omit<T, 'createdDate' | 'createdBy' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  createdBy?: string | null;
  lastModifiedDate?: string | null;
};

export type RestMyService = RestOf<MyService>;

export type NewRestMyService = RestOf<NewMyService>;

export type PartialUpdateRestMyService = RestOf<PartialUpdateMyService>;

export type EntityResponseType = HttpResponse<MyService>;
export type EntityArrayResponseType = HttpResponse<MyService[]>;
export type EntityResponseDetailType = HttpResponse<MyServiceDetail>;

@Injectable({ providedIn: 'root' })
export class MyServiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/my-services');
  public resourceUrlSearchDetail = SERVER_API_URL + 'api/my-services/_search/detail';
  public resourceUrlDetail = SERVER_API_URL + 'api/my-services/detail';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(myService: MyService): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(myService);
    return this.http
      .post<RestMyService>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(myService: MyService): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(myService);
    return this.http
      .put<RestMyService>(`${this.resourceUrl}/${this.getMyServiceIdentifier(myService)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(myService: PartialUpdateMyService): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(myService);
    return this.http
      .patch<RestMyService>(`${this.resourceUrl}/${this.getMyServiceIdentifier(myService)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMyService>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMyService[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMyServiceIdentifier(myService: Pick<MyService, 'id'>): number {
    return myService.id;
  }

  compareMyService(o1: Pick<MyService, 'id'> | null, o2: Pick<MyService, 'id'> | null): boolean {
    return o1 && o2 ? this.getMyServiceIdentifier(o1) === this.getMyServiceIdentifier(o2) : o1 === o2;
  }

  addMyServiceToCollectionIfMissing<Type extends Pick<MyService, 'id'>>(
    myServiceCollection: Type[],
    ...myServicesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const myServices: Type[] = myServicesToCheck.filter(isPresent);
    if (myServices.length > 0) {
      const myServiceCollectionIdentifiers = myServiceCollection.map(myServiceItem => this.getMyServiceIdentifier(myServiceItem)!);
      const myServicesToAdd = myServices.filter(myServiceItem => {
        const myServiceIdentifier = this.getMyServiceIdentifier(myServiceItem);
        if (myServiceCollectionIdentifiers.includes(myServiceIdentifier)) {
          return false;
        }
        myServiceCollectionIdentifiers.push(myServiceIdentifier);
        return true;
      });
      return [...myServicesToAdd, ...myServiceCollection];
    }
    return myServiceCollection;
  }

  protected convertDateFromClient<T extends MyService | NewMyService | PartialUpdateMyService>(myService: T): RestOf<T> {
    return {
      ...myService,
      createdDate: myService.createdDate?.toJSON() ?? null,
      createdBy: myService.createdBy?.toJSON() ?? null,
      lastModifiedDate: myService.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restMyService: RestMyService): MyService {
    return {
      ...restMyService,
      createdDate: restMyService.createdDate ? dayjs(restMyService.createdDate) : undefined,
      createdBy: restMyService.createdBy ? dayjs(restMyService.createdBy) : undefined,
      lastModifiedDate: restMyService.lastModifiedDate ? dayjs(restMyService.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMyService>): HttpResponse<MyService> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMyService[]>): HttpResponse<MyService[]> {
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
      .get<MyService[]>(this.resourceUrlSearchDetail, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  findByInvoiceId(id?: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<MyService[]>(`${this.resourceUrl}/invoice/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  queryDetail(req?: any): Observable<EntityResponseDetailType> {
    const options = createRequestOption(req);
    return this.http
      .get<MyServiceDetail>(this.resourceUrlDetail, { params: options, observe: 'response' })
      .pipe(map((res: EntityResponseDetailType) => res));
  }

  searchDetail(req?: any): Observable<EntityResponseDetailType> {
    const options = createRequestOption(req);
    return this.http
      .get<MyServiceDetail>(this.resourceUrlSearchDetail, { params: options, observe: 'response' })
      .pipe(map((res: EntityResponseDetailType) => res));
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((myService: MyService) => {
        myService.lastModifiedDate = myService.lastModifiedDate ? dayjs(myService.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
