import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Invoice, NewInvoice } from '../invoice.model';

export type PartialUpdateInvoice = Partial<Invoice> & Pick<Invoice, 'id'>;

type RestOf<T extends Invoice | NewInvoice> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestInvoice = RestOf<Invoice>;

export type NewRestInvoice = RestOf<NewInvoice>;

export type PartialUpdateRestInvoice = RestOf<PartialUpdateInvoice>;

export type EntityResponseType = HttpResponse<Invoice>;
export type EntityArrayResponseType = HttpResponse<Invoice[]>;

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/invoices');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(invoice: Invoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(invoice);
    return this.http
      .post<RestInvoice>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(invoice: Invoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(invoice);
    return this.http
      .put<RestInvoice>(`${this.resourceUrl}/${this.getInvoiceIdentifier(invoice)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(invoice: PartialUpdateInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(invoice);
    return this.http
      .patch<RestInvoice>(`${this.resourceUrl}/${this.getInvoiceIdentifier(invoice)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInvoice>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInvoice[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInvoiceIdentifier(invoice: Pick<Invoice, 'id'>): number {
    return invoice.id;
  }

  compareInvoice(o1: Pick<Invoice, 'id'> | null, o2: Pick<Invoice, 'id'> | null): boolean {
    return o1 && o2 ? this.getInvoiceIdentifier(o1) === this.getInvoiceIdentifier(o2) : o1 === o2;
  }

  addInvoiceToCollectionIfMissing<Type extends Pick<Invoice, 'id'>>(
    invoiceCollection: Type[],
    ...invoicesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const invoices: Type[] = invoicesToCheck.filter(isPresent);
    if (invoices.length > 0) {
      const invoiceCollectionIdentifiers = invoiceCollection.map(invoiceItem => this.getInvoiceIdentifier(invoiceItem)!);
      const invoicesToAdd = invoices.filter(invoiceItem => {
        const invoiceIdentifier = this.getInvoiceIdentifier(invoiceItem);
        if (invoiceCollectionIdentifiers.includes(invoiceIdentifier)) {
          return false;
        }
        invoiceCollectionIdentifiers.push(invoiceIdentifier);
        return true;
      });
      return [...invoicesToAdd, ...invoiceCollection];
    }
    return invoiceCollection;
  }

  protected convertDateFromClient<T extends Invoice | NewInvoice | PartialUpdateInvoice>(invoice: T): RestOf<T> {
    return {
      ...invoice,
      createdDate: invoice.createdDate?.toJSON() ?? null,
      lastModifiedDate: invoice.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restInvoice: RestInvoice): Invoice {
    return {
      ...restInvoice,
      createdDate: restInvoice.createdDate ? dayjs(restInvoice.createdDate) : undefined,
      lastModifiedDate: restInvoice.lastModifiedDate ? dayjs(restInvoice.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestInvoice>): HttpResponse<Invoice> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestInvoice[]>): HttpResponse<Invoice[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERM.2
   */

  queryByClient(req?: any, id?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Invoice[]>(`${this.resourceUrl}/client/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  protected convertDateArrayFromServer(res: EntityArrayResponseType) {
    if (res.body) {
      res.body.forEach((invoice: Invoice) => {
        invoice.createdDate = invoice.createdDate ? dayjs(invoice.createdDate) : undefined;
        invoice.lastModifiedDate = invoice.lastModifiedDate ? dayjs(invoice.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
