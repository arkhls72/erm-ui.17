import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MyServiceFee, NewMyServiceFee } from '../my-service-fee.model';
import { MyServiceFeeUpdate } from '../my-service-fee-update.model';

export type PartialUpdateMyServiceFee = Partial<MyServiceFee> & Pick<MyServiceFee, 'id'>;

type RestOf<T extends MyServiceFee | NewMyServiceFee> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestMyServiceFee = RestOf<MyServiceFee>;
export type NewRestMyServiceFee = RestOf<NewMyServiceFee>;
export type PartialUpdateRestMyServiceFee = RestOf<PartialUpdateMyServiceFee>;
export type EntityResponseType = HttpResponse<MyServiceFee>;
export type EntityArrayResponseType = HttpResponse<MyServiceFee[]>;
export type EntityArrayResponseUpdateType = HttpResponse<MyServiceFee[]>;

@Injectable({ providedIn: 'root' })
export class MyServiceFeeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/my-service-fees');
  public resourceUrlByServiceId = this.resourceUrl + 'api/my-service-fees/myService';
  public resourceUrlAll = this.resourceUrl + '/all';

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(myServiceFee: NewMyServiceFee): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(myServiceFee);
    return this.http
      .post<RestMyServiceFee>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(myServiceFee: MyServiceFee): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(myServiceFee);
    return this.http
      .put<RestMyServiceFee>(`${this.resourceUrl}/${this.getMyServiceFeeIdentifier(myServiceFee)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(myServiceFee: PartialUpdateMyServiceFee): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(myServiceFee);
    return this.http
      .patch<RestMyServiceFee>(`${this.resourceUrl}/${this.getMyServiceFeeIdentifier(myServiceFee)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMyServiceFee>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMyServiceFee[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMyServiceFeeIdentifier(myServiceFee: Pick<MyServiceFee, 'id'>): number {
    return myServiceFee.id;
  }

  compareMyServiceFee(o1: Pick<MyServiceFee, 'id'> | null, o2: Pick<MyServiceFee, 'id'> | null): boolean {
    return o1 && o2 ? this.getMyServiceFeeIdentifier(o1) === this.getMyServiceFeeIdentifier(o2) : o1 === o2;
  }

  addMyServiceFeeToCollectionIfMissing<Type extends Pick<MyServiceFee, 'id'>>(
    myServiceFeeCollection: Type[],
    ...myServiceFeesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const myServiceFees: Type[] = myServiceFeesToCheck.filter(isPresent);
    if (myServiceFees.length > 0) {
      const myServiceFeeCollectionIdentifiers = myServiceFeeCollection.map(
        myServiceFeeItem => this.getMyServiceFeeIdentifier(myServiceFeeItem)!,
      );
      const myServiceFeesToAdd = myServiceFees.filter(myServiceFeeItem => {
        const myServiceFeeIdentifier = this.getMyServiceFeeIdentifier(myServiceFeeItem);
        if (myServiceFeeCollectionIdentifiers.includes(myServiceFeeIdentifier)) {
          return false;
        }
        myServiceFeeCollectionIdentifiers.push(myServiceFeeIdentifier);
        return true;
      });
      return [...myServiceFeesToAdd, ...myServiceFeeCollection];
    }
    return myServiceFeeCollection;
  }

  protected convertDateFromClient<T extends MyServiceFee | NewMyServiceFee | PartialUpdateMyServiceFee>(myServiceFee: T): RestOf<T> {
    return {
      ...myServiceFee,
      createdDate: myServiceFee.createdDate?.toJSON() ?? null,
      lastModifiedDate: myServiceFee.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restMyServiceFee: RestMyServiceFee): MyServiceFee {
    return {
      ...restMyServiceFee,
      createdDate: restMyServiceFee.createdDate ? dayjs(restMyServiceFee.createdDate) : undefined,
      lastModifiedDate: restMyServiceFee.lastModifiedDate ? dayjs(restMyServiceFee.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMyServiceFee>): HttpResponse<MyServiceFee> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMyServiceFee[]>): HttpResponse<MyServiceFee[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /*****************************
   * ERM2
   ***************************/

  findByServiceId(id?: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<MyServiceFee[]>(`${this.resourceUrlByServiceId}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  createList(myServiceFeeUpdate: MyServiceFeeUpdate): Observable<EntityArrayResponseType> {
    myServiceFeeUpdate.myServiceFees = this.convertListDateFromClient(myServiceFeeUpdate.myServiceFees);
    const copy = myServiceFeeUpdate;
    return (
      this.http
        .post<MyServiceFee[]>(this.resourceUrlAll, copy, { observe: 'response' })
        // .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
        .pipe(map(res => this.convertDateArrayFromServer(res)))
    );
  }

  protected convertListDateFromClient(myServiceFeeList: MyServiceFee[]): MyServiceFee[] {
    const response: MyServiceFee[] = myServiceFeeList;
    response.forEach((myServiceFee: MyServiceFee) => {
      this.convertDateFromClient(myServiceFee);
    });

    return response;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((myServiceFee: MyServiceFee) => {
        myServiceFee.createdDate = myServiceFee.createdDate ? dayjs(myServiceFee.createdDate) : null;
        myServiceFee.lastModifiedDate = myServiceFee.lastModifiedDate ? dayjs(myServiceFee.lastModifiedDate) : null;
      });
    }
    return res;
  }
}
