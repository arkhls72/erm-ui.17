import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ClientInvoice, NewClientInvoice } from '../client-invoice.model';

export type PartialUpdateClientInvoice = Partial<ClientInvoice> & Pick<ClientInvoice, 'id'>;

type RestOf<T extends ClientInvoice | NewClientInvoice> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestClientInvoice = RestOf<ClientInvoice>;

export type NewRestClientInvoice = RestOf<NewClientInvoice>;

export type PartialUpdateRestClientInvoice = RestOf<PartialUpdateClientInvoice>;

export type EntityResponseType = HttpResponse<ClientInvoice>;
export type EntityArrayResponseType = HttpResponse<ClientInvoice[]>;

@Injectable({ providedIn: 'root' })
export class ClientInvoiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/client-invoices');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(clientInvoice: NewClientInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clientInvoice);
    return this.http
      .post<RestClientInvoice>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(clientInvoice: ClientInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clientInvoice);
    return this.http
      .put<RestClientInvoice>(`${this.resourceUrl}/${this.getClientInvoiceIdentifier(clientInvoice)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(clientInvoice: PartialUpdateClientInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clientInvoice);
    return this.http
      .patch<RestClientInvoice>(`${this.resourceUrl}/${this.getClientInvoiceIdentifier(clientInvoice)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestClientInvoice>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestClientInvoice[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getClientInvoiceIdentifier(clientInvoice: Pick<ClientInvoice, 'id'>): number {
    return clientInvoice.id;
  }

  compareClientInvoice(o1: Pick<ClientInvoice, 'id'> | null, o2: Pick<ClientInvoice, 'id'> | null): boolean {
    return o1 && o2 ? this.getClientInvoiceIdentifier(o1) === this.getClientInvoiceIdentifier(o2) : o1 === o2;
  }

  addClientInvoiceToCollectionIfMissing<Type extends Pick<ClientInvoice, 'id'>>(
    clientInvoiceCollection: Type[],
    ...clientInvoicesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const clientInvoices: Type[] = clientInvoicesToCheck.filter(isPresent);
    if (clientInvoices.length > 0) {
      const clientInvoiceCollectionIdentifiers = clientInvoiceCollection.map(
        clientInvoiceItem => this.getClientInvoiceIdentifier(clientInvoiceItem)!,
      );
      const clientInvoicesToAdd = clientInvoices.filter(clientInvoiceItem => {
        const clientInvoiceIdentifier = this.getClientInvoiceIdentifier(clientInvoiceItem);
        if (clientInvoiceCollectionIdentifiers.includes(clientInvoiceIdentifier)) {
          return false;
        }
        clientInvoiceCollectionIdentifiers.push(clientInvoiceIdentifier);
        return true;
      });
      return [...clientInvoicesToAdd, ...clientInvoiceCollection];
    }
    return clientInvoiceCollection;
  }

  protected convertDateFromClient<T extends ClientInvoice | NewClientInvoice | PartialUpdateClientInvoice>(clientInvoice: T): RestOf<T> {
    return {
      ...clientInvoice,
      createdDate: clientInvoice.createdDate?.toJSON() ?? null,
      lastModifiedDate: clientInvoice.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restClientInvoice: RestClientInvoice): ClientInvoice {
    return {
      ...restClientInvoice,
      createdDate: restClientInvoice.createdDate ? dayjs(restClientInvoice.createdDate) : undefined,
      lastModifiedDate: restClientInvoice.lastModifiedDate ? dayjs(restClientInvoice.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestClientInvoice>): HttpResponse<ClientInvoice> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestClientInvoice[]>): HttpResponse<ClientInvoice[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
