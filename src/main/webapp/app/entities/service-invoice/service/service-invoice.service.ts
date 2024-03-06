import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ServiceInvoice, NewServiceInvoice } from '../service-invoice.model';

export type PartialUpdateServiceInvoice = Partial<ServiceInvoice> & Pick<ServiceInvoice, 'id'>;

type RestOf<T extends ServiceInvoice | NewServiceInvoice> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestServiceInvoice = RestOf<ServiceInvoice>;

export type NewRestServiceInvoice = RestOf<NewServiceInvoice>;

export type PartialUpdateRestServiceInvoice = RestOf<PartialUpdateServiceInvoice>;

export type EntityResponseType = HttpResponse<ServiceInvoice>;
export type EntityArrayResponseType = HttpResponse<ServiceInvoice[]>;

@Injectable({ providedIn: 'root' })
export class ServiceInvoiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/service-invoices');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(serviceInvoice: NewServiceInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceInvoice);
    return this.http
      .post<RestServiceInvoice>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(serviceInvoice: ServiceInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceInvoice);
    return this.http
      .put<RestServiceInvoice>(`${this.resourceUrl}/${this.getServiceInvoiceIdentifier(serviceInvoice)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(serviceInvoice: PartialUpdateServiceInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceInvoice);
    return this.http
      .patch<RestServiceInvoice>(`${this.resourceUrl}/${this.getServiceInvoiceIdentifier(serviceInvoice)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestServiceInvoice>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestServiceInvoice[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getServiceInvoiceIdentifier(serviceInvoice: Pick<ServiceInvoice, 'id'>): number {
    return serviceInvoice.id;
  }

  compareServiceInvoice(o1: Pick<ServiceInvoice, 'id'> | null, o2: Pick<ServiceInvoice, 'id'> | null): boolean {
    return o1 && o2 ? this.getServiceInvoiceIdentifier(o1) === this.getServiceInvoiceIdentifier(o2) : o1 === o2;
  }

  addServiceInvoiceToCollectionIfMissing<Type extends Pick<ServiceInvoice, 'id'>>(
    serviceInvoiceCollection: Type[],
    ...serviceInvoicesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const serviceInvoices: Type[] = serviceInvoicesToCheck.filter(isPresent);
    if (serviceInvoices.length > 0) {
      const serviceInvoiceCollectionIdentifiers = serviceInvoiceCollection.map(
        serviceInvoiceItem => this.getServiceInvoiceIdentifier(serviceInvoiceItem)!,
      );
      const serviceInvoicesToAdd = serviceInvoices.filter(serviceInvoiceItem => {
        const serviceInvoiceIdentifier = this.getServiceInvoiceIdentifier(serviceInvoiceItem);
        if (serviceInvoiceCollectionIdentifiers.includes(serviceInvoiceIdentifier)) {
          return false;
        }
        serviceInvoiceCollectionIdentifiers.push(serviceInvoiceIdentifier);
        return true;
      });
      return [...serviceInvoicesToAdd, ...serviceInvoiceCollection];
    }
    return serviceInvoiceCollection;
  }

  protected convertDateFromClient<T extends ServiceInvoice | NewServiceInvoice | PartialUpdateServiceInvoice>(
    serviceInvoice: T,
  ): RestOf<T> {
    return {
      ...serviceInvoice,
      createdDate: serviceInvoice.createdDate?.toJSON() ?? null,
      lastModifiedDate: serviceInvoice.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restServiceInvoice: RestServiceInvoice): ServiceInvoice {
    return {
      ...restServiceInvoice,
      createdDate: restServiceInvoice.createdDate ? dayjs(restServiceInvoice.createdDate) : undefined,
      lastModifiedDate: restServiceInvoice.lastModifiedDate ? dayjs(restServiceInvoice.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestServiceInvoice>): HttpResponse<ServiceInvoice> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestServiceInvoice[]>): HttpResponse<ServiceInvoice[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERM2
   */

  findByInvoiceId(id?: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<ServiceInvoice[]>(`${this.resourceUrl}/invoice/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((serviceInvoice: ServiceInvoice) => {
        serviceInvoice.createdDate = serviceInvoice.createdDate ? dayjs(serviceInvoice.createdDate) : undefined;
        serviceInvoice.lastModifiedDate = serviceInvoice.lastModifiedDate ? dayjs(serviceInvoice.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
