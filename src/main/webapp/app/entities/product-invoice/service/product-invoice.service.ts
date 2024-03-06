import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ProductInvoice, NewProductInvoice } from '../product-invoice.model';
import { ServiceInvoice } from '../../service-invoice/service-invoice.model';

export type PartialUpdateProductInvoice = Partial<ProductInvoice> & Pick<ProductInvoice, 'id'>;

type RestOf<T extends ProductInvoice | NewProductInvoice> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestProductInvoice = RestOf<ProductInvoice>;
export type NewRestProductInvoice = RestOf<NewProductInvoice>;
export type PartialUpdateRestProductInvoice = RestOf<PartialUpdateProductInvoice>;

export type EntityResponseType = HttpResponse<ProductInvoice>;
export type EntityArrayResponseType = HttpResponse<ProductInvoice[]>;

@Injectable({ providedIn: 'root' })
export class ProductInvoiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/product-invoices');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(productInvoice: NewProductInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productInvoice);
    return this.http
      .post<RestProductInvoice>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(productInvoice: ProductInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productInvoice);
    return this.http
      .put<RestProductInvoice>(`${this.resourceUrl}/${this.getProductInvoiceIdentifier(productInvoice)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(productInvoice: PartialUpdateProductInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productInvoice);
    return this.http
      .patch<RestProductInvoice>(`${this.resourceUrl}/${this.getProductInvoiceIdentifier(productInvoice)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProductInvoice>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProductInvoice[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProductInvoiceIdentifier(productInvoice: Pick<ProductInvoice, 'id'>): number {
    return productInvoice.id;
  }

  compareProductInvoice(o1: Pick<ProductInvoice, 'id'> | null, o2: Pick<ProductInvoice, 'id'> | null): boolean {
    return o1 && o2 ? this.getProductInvoiceIdentifier(o1) === this.getProductInvoiceIdentifier(o2) : o1 === o2;
  }

  addProductInvoiceToCollectionIfMissing<Type extends Pick<ProductInvoice, 'id'>>(
    productInvoiceCollection: Type[],
    ...productInvoicesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const productInvoices: Type[] = productInvoicesToCheck.filter(isPresent);
    if (productInvoices.length > 0) {
      const productInvoiceCollectionIdentifiers = productInvoiceCollection.map(
        productInvoiceItem => this.getProductInvoiceIdentifier(productInvoiceItem)!,
      );
      const productInvoicesToAdd = productInvoices.filter(productInvoiceItem => {
        const productInvoiceIdentifier = this.getProductInvoiceIdentifier(productInvoiceItem);
        if (productInvoiceCollectionIdentifiers.includes(productInvoiceIdentifier)) {
          return false;
        }
        productInvoiceCollectionIdentifiers.push(productInvoiceIdentifier);
        return true;
      });
      return [...productInvoicesToAdd, ...productInvoiceCollection];
    }
    return productInvoiceCollection;
  }

  protected convertDateFromClient<T extends ProductInvoice | NewProductInvoice | PartialUpdateProductInvoice>(
    productInvoice: T,
  ): RestOf<T> {
    return {
      ...productInvoice,
      createdDate: productInvoice.createdDate?.toJSON() ?? null,
      lastModifiedDate: productInvoice.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restProductInvoice: RestProductInvoice): ProductInvoice {
    return {
      ...restProductInvoice,
      createdDate: restProductInvoice.createdDate ? dayjs(restProductInvoice.createdDate) : undefined,
      lastModifiedDate: restProductInvoice.lastModifiedDate ? dayjs(restProductInvoice.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProductInvoice>): HttpResponse<ProductInvoice> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProductInvoice[]>): HttpResponse<ProductInvoice[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERM.2
   */
  findByInvoiceId(id?: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<ServiceInvoice[]>(`${this.resourceUrl}/invoice/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((productInvoice: ProductInvoice) => {
        productInvoice.createdDate = productInvoice.createdDate ? dayjs(productInvoice.createdDate) : undefined;
        productInvoice.lastModifiedDate = productInvoice.lastModifiedDate ? dayjs(productInvoice.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
