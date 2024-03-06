import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { PaymentInvoice, NewPaymentInvoice } from '../payment-invoice.model';

export type PartialUpdatePaymentInvoice = Partial<PaymentInvoice> & Pick<PaymentInvoice, 'id'>;

type RestOf<T extends PaymentInvoice | NewPaymentInvoice> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestPaymentInvoice = RestOf<PaymentInvoice>;

export type NewRestPaymentInvoice = RestOf<NewPaymentInvoice>;

export type PartialUpdateRestPaymentInvoice = RestOf<PartialUpdatePaymentInvoice>;

export type EntityResponseType = HttpResponse<PaymentInvoice>;
export type EntityArrayResponseType = HttpResponse<PaymentInvoice[]>;

@Injectable({ providedIn: 'root' })
export class PaymentInvoiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/payment-invoices');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(paymentInvoice: NewPaymentInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentInvoice);
    return this.http
      .post<RestPaymentInvoice>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(paymentInvoice: PaymentInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentInvoice);
    return this.http
      .put<RestPaymentInvoice>(`${this.resourceUrl}/${this.getPaymentInvoiceIdentifier(paymentInvoice)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(paymentInvoice: PartialUpdatePaymentInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentInvoice);
    return this.http
      .patch<RestPaymentInvoice>(`${this.resourceUrl}/${this.getPaymentInvoiceIdentifier(paymentInvoice)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPaymentInvoice>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPaymentInvoice[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPaymentInvoiceIdentifier(paymentInvoice: Pick<PaymentInvoice, 'id'>): number {
    return paymentInvoice.id;
  }

  comparePaymentInvoice(o1: Pick<PaymentInvoice, 'id'> | null, o2: Pick<PaymentInvoice, 'id'> | null): boolean {
    return o1 && o2 ? this.getPaymentInvoiceIdentifier(o1) === this.getPaymentInvoiceIdentifier(o2) : o1 === o2;
  }

  addPaymentInvoiceToCollectionIfMissing<Type extends Pick<PaymentInvoice, 'id'>>(
    paymentInvoiceCollection: Type[],
    ...paymentInvoicesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const paymentInvoices: Type[] = paymentInvoicesToCheck.filter(isPresent);
    if (paymentInvoices.length > 0) {
      const paymentInvoiceCollectionIdentifiers = paymentInvoiceCollection.map(
        paymentInvoiceItem => this.getPaymentInvoiceIdentifier(paymentInvoiceItem)!,
      );
      const paymentInvoicesToAdd = paymentInvoices.filter(paymentInvoiceItem => {
        const paymentInvoiceIdentifier = this.getPaymentInvoiceIdentifier(paymentInvoiceItem);
        if (paymentInvoiceCollectionIdentifiers.includes(paymentInvoiceIdentifier)) {
          return false;
        }
        paymentInvoiceCollectionIdentifiers.push(paymentInvoiceIdentifier);
        return true;
      });
      return [...paymentInvoicesToAdd, ...paymentInvoiceCollection];
    }
    return paymentInvoiceCollection;
  }

  protected convertDateFromClient<T extends PaymentInvoice | NewPaymentInvoice | PartialUpdatePaymentInvoice>(
    paymentInvoice: T,
  ): RestOf<T> {
    return {
      ...paymentInvoice,
      createdDate: paymentInvoice.createdDate?.toJSON() ?? null,
      lastModifiedDate: paymentInvoice.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPaymentInvoice: RestPaymentInvoice | PaymentInvoice): PaymentInvoice {
    return {
      ...restPaymentInvoice,
      createdDate: restPaymentInvoice.createdDate ? dayjs(restPaymentInvoice.createdDate) : undefined,
      lastModifiedDate: restPaymentInvoice.lastModifiedDate ? dayjs(restPaymentInvoice.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPaymentInvoice> | HttpResponse<PaymentInvoice>): HttpResponse<PaymentInvoice> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPaymentInvoice[]>): HttpResponse<PaymentInvoice[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERm.2
   */

  findByInvoiceId(id?: number): Observable<EntityResponseType> {
    return this.http
      .get<PaymentInvoice>(`${this.resourceUrl}/invoice/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }
}
