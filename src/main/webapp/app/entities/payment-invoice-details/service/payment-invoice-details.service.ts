import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { PaymentInvoiceDetails, NewPaymentInvoiceDetails } from '../payment-invoice-details.model';

export type PartialUpdatePaymentInvoiceDetails = Partial<PaymentInvoiceDetails> & Pick<PaymentInvoiceDetails, 'id'>;

type RestOf<T extends PaymentInvoiceDetails | NewPaymentInvoiceDetails> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestPaymentInvoiceDetails = RestOf<PaymentInvoiceDetails>;

export type NewRestPaymentInvoiceDetails = RestOf<NewPaymentInvoiceDetails>;

export type PartialUpdateRestPaymentInvoiceDetails = RestOf<PartialUpdatePaymentInvoiceDetails>;

export type EntityResponseType = HttpResponse<PaymentInvoiceDetails>;
export type EntityArrayResponseType = HttpResponse<PaymentInvoiceDetails[]>;

@Injectable({ providedIn: 'root' })
export class PaymentInvoiceDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/payment-invoice-details');
  public resourceUrlPayment = SERVER_API_URL + 'api/payment-invoice-details/payment';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(paymentInvoiceDetails: NewPaymentInvoiceDetails | PaymentInvoiceDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentInvoiceDetails);
    return this.http
      .post<RestPaymentInvoiceDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(paymentInvoiceDetails: PaymentInvoiceDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentInvoiceDetails);
    return this.http
      .put<RestPaymentInvoiceDetails>(`${this.resourceUrl}/${this.getPaymentInvoiceDetailsIdentifier(paymentInvoiceDetails)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(paymentInvoiceDetails: PartialUpdatePaymentInvoiceDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentInvoiceDetails);
    return this.http
      .patch<RestPaymentInvoiceDetails>(`${this.resourceUrl}/${this.getPaymentInvoiceDetailsIdentifier(paymentInvoiceDetails)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPaymentInvoiceDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPaymentInvoiceDetails[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPaymentInvoiceDetailsIdentifier(paymentInvoiceDetails: Pick<PaymentInvoiceDetails, 'id'>): number {
    return paymentInvoiceDetails.id;
  }

  comparePaymentInvoiceDetails(o1: Pick<PaymentInvoiceDetails, 'id'> | null, o2: Pick<PaymentInvoiceDetails, 'id'> | null): boolean {
    return o1 && o2 ? this.getPaymentInvoiceDetailsIdentifier(o1) === this.getPaymentInvoiceDetailsIdentifier(o2) : o1 === o2;
  }

  addPaymentInvoiceDetailsToCollectionIfMissing<Type extends Pick<PaymentInvoiceDetails, 'id'>>(
    paymentInvoiceDetailsCollection: Type[],
    ...paymentInvoiceDetailsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const paymentInvoiceDetails: Type[] = paymentInvoiceDetailsToCheck.filter(isPresent);
    if (paymentInvoiceDetails.length > 0) {
      const paymentInvoiceDetailsCollectionIdentifiers = paymentInvoiceDetailsCollection.map(
        paymentInvoiceDetailsItem => this.getPaymentInvoiceDetailsIdentifier(paymentInvoiceDetailsItem)!,
      );
      const paymentInvoiceDetailsToAdd = paymentInvoiceDetails.filter(paymentInvoiceDetailsItem => {
        const paymentInvoiceDetailsIdentifier = this.getPaymentInvoiceDetailsIdentifier(paymentInvoiceDetailsItem);
        if (paymentInvoiceDetailsCollectionIdentifiers.includes(paymentInvoiceDetailsIdentifier)) {
          return false;
        }
        paymentInvoiceDetailsCollectionIdentifiers.push(paymentInvoiceDetailsIdentifier);
        return true;
      });
      return [...paymentInvoiceDetailsToAdd, ...paymentInvoiceDetailsCollection];
    }
    return paymentInvoiceDetailsCollection;
  }

  protected convertDateFromClient<T extends PaymentInvoiceDetails | NewPaymentInvoiceDetails | PartialUpdatePaymentInvoiceDetails>(
    paymentInvoiceDetails: T,
  ): RestOf<T> {
    return {
      ...paymentInvoiceDetails,
      createdDate: paymentInvoiceDetails.createdDate?.toJSON() ?? null,
      lastModifiedDate: paymentInvoiceDetails.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPaymentInvoiceDetails: RestPaymentInvoiceDetails): PaymentInvoiceDetails {
    return {
      ...restPaymentInvoiceDetails,
      createdDate: restPaymentInvoiceDetails.createdDate ? dayjs(restPaymentInvoiceDetails.createdDate) : undefined,
      lastModifiedDate: restPaymentInvoiceDetails.lastModifiedDate ? dayjs(restPaymentInvoiceDetails.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPaymentInvoiceDetails>): HttpResponse<PaymentInvoiceDetails> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPaymentInvoiceDetails[]>): HttpResponse<PaymentInvoiceDetails[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERM.2
   */

  findByPaymentInvoiceId(id?: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<PaymentInvoiceDetails[]>(`${this.resourceUrlPayment}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((paymentInvoiceDetails: PaymentInvoiceDetails) => {
        paymentInvoiceDetails.createdDate = paymentInvoiceDetails.createdDate ? dayjs(paymentInvoiceDetails.createdDate) : undefined;
        paymentInvoiceDetails.lastModifiedDate = paymentInvoiceDetails.lastModifiedDate
          ? dayjs(paymentInvoiceDetails.lastModifiedDate)
          : undefined;
      });
    }
    return res;
  }

  findByInvoiceId(id?: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<PaymentInvoiceDetails[]>(`${this.resourceUrl}/invoice/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
}
