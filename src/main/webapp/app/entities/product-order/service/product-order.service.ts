import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ProductOrder, NewProductOrder } from '../product-order.model';
import { ProductOrderUpdate } from '../product-order-update.model';

export type PartialUpdateProductOrder = Partial<ProductOrder> & Pick<ProductOrder, 'id'>;

type RestOf<T extends ProductOrder | NewProductOrder> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestProductOrder = RestOf<ProductOrder>;

export type NewRestProductOrder = RestOf<NewProductOrder>;

export type PartialUpdateRestProductOrder = RestOf<PartialUpdateProductOrder>;

export type EntityResponseType = HttpResponse<ProductOrder>;
export type EntityArrayResponseType = HttpResponse<ProductOrder[]>;

@Injectable({ providedIn: 'root' })
export class ProductOrderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/product-orders');
  public resourceUrlOrder = this.resourceUrl + '/order';
  public resourceUrlAll = this.resourceUrl + '/all';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(productOrder: ProductOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productOrder);
    return this.http
      .post<RestProductOrder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(productOrder: ProductOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productOrder);
    return this.http
      .put<RestProductOrder>(`${this.resourceUrl}/${this.getProductOrderIdentifier(productOrder)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(productOrder: PartialUpdateProductOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productOrder);
    return this.http
      .patch<RestProductOrder>(`${this.resourceUrl}/${this.getProductOrderIdentifier(productOrder)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProductOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProductOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProductOrderIdentifier(productOrder: Pick<ProductOrder, 'id'>): number {
    return productOrder.id;
  }

  compareProductOrder(o1: Pick<ProductOrder, 'id'> | null, o2: Pick<ProductOrder, 'id'> | null): boolean {
    return o1 && o2 ? this.getProductOrderIdentifier(o1) === this.getProductOrderIdentifier(o2) : o1 === o2;
  }

  addProductOrderToCollectionIfMissing<Type extends Pick<ProductOrder, 'id'>>(
    productOrderCollection: Type[],
    ...productOrdersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const productOrders: Type[] = productOrdersToCheck.filter(isPresent);
    if (productOrders.length > 0) {
      const productOrderCollectionIdentifiers = productOrderCollection.map(
        productOrderItem => this.getProductOrderIdentifier(productOrderItem)!,
      );
      const productOrdersToAdd = productOrders.filter(productOrderItem => {
        const productOrderIdentifier = this.getProductOrderIdentifier(productOrderItem);
        if (productOrderCollectionIdentifiers.includes(productOrderIdentifier)) {
          return false;
        }
        productOrderCollectionIdentifiers.push(productOrderIdentifier);
        return true;
      });
      return [...productOrdersToAdd, ...productOrderCollection];
    }
    return productOrderCollection;
  }

  protected convertDateFromClient<T extends ProductOrder | NewProductOrder | PartialUpdateProductOrder>(productOrder: T): RestOf<T> {
    return {
      ...productOrder,
      createdDate: productOrder.createdDate?.toJSON() ?? null,
      lastModifiedDate: productOrder.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restProductOrder: RestProductOrder): ProductOrder {
    return {
      ...restProductOrder,
      createdDate: restProductOrder.createdDate ? dayjs(restProductOrder.createdDate) : undefined,
      lastModifiedDate: restProductOrder.lastModifiedDate ? dayjs(restProductOrder.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProductOrder>): HttpResponse<ProductOrder> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProductOrder[]>): HttpResponse<ProductOrder[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /*******************************************************************
   *** from ERM.2
   *******************************************************************/

  findByOrderNumber(id?: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<ProductOrder[]>(`${this.resourceUrlOrder}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((productOrder: ProductOrder) => {
        productOrder.createdDate = productOrder.createdDate ? dayjs(productOrder.createdDate) : null;
        productOrder.lastModifiedDate = productOrder.lastModifiedDate ? dayjs(productOrder.lastModifiedDate) : null;
      });
    }
    return res;
  }
  protected convertListDateFromClient(productOrderList: ProductOrder[]): ProductOrder[] {
    const response = productOrderList;
    response.forEach((productOrder: ProductOrder) => {
      this.convertDateFromClient(productOrder);
    });

    return response;
  }
  updateList(productOrderUpdate: ProductOrderUpdate): Observable<EntityArrayResponseType> {
    const productOrders: ProductOrder[] = productOrderUpdate.productOrders || [];
    const copy = this.convertListDateFromClient(productOrders);
    productOrderUpdate.productOrders = copy;
    return this.http
      .put<ProductOrder[]>(this.resourceUrlAll, productOrderUpdate, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
}
