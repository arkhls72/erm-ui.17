import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { OrderPayment, NewOrderPayment } from '../order-payment.model';
import { OrderPaymentUpdate } from '../order-payment-update.model';
import { Order } from '../../order/order.model';

export type PartialUpdateOrderPayment = Partial<OrderPayment> & Pick<OrderPayment, 'id'>;

type RestOf<T extends OrderPayment | NewOrderPayment> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestOrderPayment = RestOf<OrderPayment>;

export type NewRestOrderPayment = RestOf<NewOrderPayment>;

export type PartialUpdateRestOrderPayment = RestOf<PartialUpdateOrderPayment>;

export type EntityResponseType = HttpResponse<OrderPayment>;
export type EntityResponseUpdateType = HttpResponse<OrderPaymentUpdate>;
export type EntityArrayResponseType = HttpResponse<OrderPayment[]>;

@Injectable({ providedIn: 'root' })
export class OrderPaymentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/order-payments');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(orderPayment: NewOrderPayment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orderPayment);
    return this.http
      .post<RestOrderPayment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(orderPayment: OrderPayment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orderPayment);
    return this.http
      .put<RestOrderPayment>(`${this.resourceUrl}/${this.getOrderPaymentIdentifier(orderPayment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(orderPayment: PartialUpdateOrderPayment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orderPayment);
    return this.http
      .patch<RestOrderPayment>(`${this.resourceUrl}/${this.getOrderPaymentIdentifier(orderPayment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestOrderPayment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestOrderPayment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOrderPaymentIdentifier(orderPayment: Pick<OrderPayment, 'id'>): number {
    return orderPayment.id;
  }

  compareOrderPayment(o1: Pick<OrderPayment, 'id'> | null, o2: Pick<OrderPayment, 'id'> | null): boolean {
    return o1 && o2 ? this.getOrderPaymentIdentifier(o1) === this.getOrderPaymentIdentifier(o2) : o1 === o2;
  }

  addOrderPaymentToCollectionIfMissing<Type extends Pick<OrderPayment, 'id'>>(
    orderPaymentCollection: Type[],
    ...orderPaymentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const orderPayments: Type[] = orderPaymentsToCheck.filter(isPresent);
    if (orderPayments.length > 0) {
      const orderPaymentCollectionIdentifiers = orderPaymentCollection.map(
        orderPaymentItem => this.getOrderPaymentIdentifier(orderPaymentItem)!,
      );
      const orderPaymentsToAdd = orderPayments.filter(orderPaymentItem => {
        const orderPaymentIdentifier = this.getOrderPaymentIdentifier(orderPaymentItem);
        if (orderPaymentCollectionIdentifiers.includes(orderPaymentIdentifier)) {
          return false;
        }
        orderPaymentCollectionIdentifiers.push(orderPaymentIdentifier);
        return true;
      });
      return [...orderPaymentsToAdd, ...orderPaymentCollection];
    }
    return orderPaymentCollection;
  }

  protected convertDateFromClient<T extends OrderPayment | NewOrderPayment | PartialUpdateOrderPayment>(orderPayment: T): RestOf<T> {
    return {
      ...orderPayment,
      createdDate: orderPayment.createdDate?.toJSON() ?? null,
      lastModifiedDate: orderPayment.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restOrderPayment: RestOrderPayment): OrderPayment {
    return {
      ...restOrderPayment,
      createdDate: restOrderPayment.createdDate ? dayjs(restOrderPayment.createdDate) : undefined,
      lastModifiedDate: restOrderPayment.lastModifiedDate ? dayjs(restOrderPayment.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestOrderPayment>): HttpResponse<OrderPayment> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestOrderPayment[]>): HttpResponse<OrderPayment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**********************************************
   * ERM.2
   **********************************************/

  findByOrderId(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestOrderPayment>(`${this.resourceUrl}/order/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  saveForUpdate(orderPaymentUpdate: OrderPaymentUpdate): Observable<EntityResponseUpdateType> {
    const copy = orderPaymentUpdate;
    return this.http
      .put<OrderPaymentUpdate>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertDateFromServerForUpdate(res)));
  }
  // protected convertResponseUpdateFromServer(res: HttpResponse<OrderPaymentUpdate>): HttpResponse<OrderPaymentUpdate> {
  //   return res.clone({
  //     body: res.body ? this.convertDateFromServer(res.body) : null,
  //   });
  // }
  protected convertDateFromServerForUpdate(res: EntityResponseUpdateType): EntityResponseUpdateType {
    if (res.body) {
      const orderPayment: OrderPayment = <OrderPayment>res.body.orderPayment;
      const order: Order = <Order>res.body.order;

      orderPayment.createdDate = orderPayment && orderPayment?.createdDate ? dayjs(orderPayment.createdDate) : null;
      orderPayment.lastModifiedDate = orderPayment.lastModifiedDate ? dayjs(orderPayment.lastModifiedDate) : null;

      order.createdDate = order.createdDate ? dayjs(order.createdDate) : undefined;
      order.lastModifiedDate = order.lastModifiedDate ? dayjs(order.lastModifiedDate) : undefined;
    }

    return res;
  }
}
