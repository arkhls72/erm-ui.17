import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MyProductFee, NewMyProductFee } from '../my-product-fee.model';
import { ShortProductFee } from '../../product/fees package-tab/short-product-fee.model';

export type PartialUpdateMyProductFee = Partial<MyProductFee> & Pick<MyProductFee, 'id'>;

type RestOf<T extends MyProductFee | NewMyProductFee> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestMyProductFee = RestOf<MyProductFee>;

export type NewRestMyProductFee = RestOf<NewMyProductFee>;

export type PartialUpdateRestMyProductFee = RestOf<PartialUpdateMyProductFee>;

export type EntityResponseType = HttpResponse<MyProductFee>;
export type EntityArrayResponseType = HttpResponse<MyProductFee[]>;

@Injectable({ providedIn: 'root' })
export class MyProductFeeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/my-product-fees');
  public resourceUrlProduct = this.resourceUrl + '/product';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(myProductFee: NewMyProductFee): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(myProductFee);
    return this.http
      .post<RestMyProductFee>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(myProductFee: MyProductFee): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(myProductFee);
    return this.http
      .put<RestMyProductFee>(`${this.resourceUrl}/${this.getMyProductFeeIdentifier(myProductFee)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(myProductFee: PartialUpdateMyProductFee): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(myProductFee);
    return this.http
      .patch<RestMyProductFee>(`${this.resourceUrl}/${this.getMyProductFeeIdentifier(myProductFee)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMyProductFee>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMyProductFee[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMyProductFeeIdentifier(myProductFee: Pick<MyProductFee, 'id'>): number {
    return myProductFee.id;
  }

  compareMyProductFee(o1: Pick<MyProductFee, 'id'> | null, o2: Pick<MyProductFee, 'id'> | null): boolean {
    return o1 && o2 ? this.getMyProductFeeIdentifier(o1) === this.getMyProductFeeIdentifier(o2) : o1 === o2;
  }

  addMyProductFeeToCollectionIfMissing<Type extends Pick<MyProductFee, 'id'>>(
    myProductFeeCollection: Type[],
    ...myProductFeesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const myProductFees: Type[] = myProductFeesToCheck.filter(isPresent);
    if (myProductFees.length > 0) {
      const myProductFeeCollectionIdentifiers = myProductFeeCollection.map(
        myProductFeeItem => this.getMyProductFeeIdentifier(myProductFeeItem)!,
      );
      const myProductFeesToAdd = myProductFees.filter(myProductFeeItem => {
        const myProductFeeIdentifier = this.getMyProductFeeIdentifier(myProductFeeItem);
        if (myProductFeeCollectionIdentifiers.includes(myProductFeeIdentifier)) {
          return false;
        }
        myProductFeeCollectionIdentifiers.push(myProductFeeIdentifier);
        return true;
      });
      return [...myProductFeesToAdd, ...myProductFeeCollection];
    }
    return myProductFeeCollection;
  }

  protected convertDateFromClient<T extends MyProductFee | NewMyProductFee | PartialUpdateMyProductFee>(myProductFee: T): RestOf<T> {
    return {
      ...myProductFee,
      createdDate: myProductFee.createdDate?.toJSON() ?? null,
      lastModifiedDate: myProductFee.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restMyProductFee: RestMyProductFee): MyProductFee {
    return {
      ...restMyProductFee,
      createdDate: restMyProductFee.createdDate ? dayjs(restMyProductFee.createdDate) : undefined,
      lastModifiedDate: restMyProductFee.lastModifiedDate ? dayjs(restMyProductFee.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMyProductFee>): HttpResponse<MyProductFee> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMyProductFee[]>): HttpResponse<MyProductFee[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /*****************************************************************************
   *  ERM.2
   ***************************************************************************/

  queryByProductId(id: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestMyProductFee[]>(`${this.resourceUrlProduct}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  updateList(shortProductFeeList: ShortProductFee[], id: number): Observable<EntityArrayResponseType> {
    return this.http
      .put<RestMyProductFee[]>(`${this.resourceUrlProduct}/${id}`, shortProductFeeList, { observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }
}
