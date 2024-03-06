import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Product, NewProduct } from '../product.model';
import { ProductDetail } from '../product-detail.model';

export type PartialUpdateProduct = Partial<Product> & Pick<Product, 'id'>;

type RestOf<T extends Product | NewProduct> = Omit<T, 'lastOrderDate' | 'createdDate' | 'lastModifiedDate'> & {
  lastOrderDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestProduct = RestOf<Product>;
export type NewRestProduct = RestOf<NewProduct>;
export type PartialUpdateRestProduct = RestOf<PartialUpdateProduct>;
export type EntityResponseType = HttpResponse<Product>;
export type EntityArrayResponseType = HttpResponse<Product[]>;
type EntityResponseProductDetailType = HttpResponse<ProductDetail>;

@Injectable({ providedIn: 'root' })
export class ProductService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/products');
  protected resourceUrlOrderSummary = this.resourceUrl + '/summary/order';
  public resourceUrlSupplierSearch = this.resourceUrl + '/_search/supplier';
  public resourceUrlSupplier = this.resourceUrl + '/supplier';
  public resourceUrlSearch = this.resourceUrl + '/_search';
  public resourceUrlSummary = this.resourceUrl + '/summary';
  public resourceDetailUrl = SERVER_API_URL + 'api/products/detail';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(product: Product): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(product);
    return this.http
      .post<RestProduct>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(product: Product): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(product);
    return this.http
      .put<RestProduct>(`${this.resourceUrl}/${this.getProductIdentifier(product)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(product: PartialUpdateProduct): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(product);
    return this.http
      .patch<RestProduct>(`${this.resourceUrl}/${this.getProductIdentifier(product)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProduct>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProduct[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProductIdentifier(product: Pick<Product, 'id'>): number {
    return product.id;
  }

  compareProduct(o1: Pick<Product, 'id'> | null, o2: Pick<Product, 'id'> | null): boolean {
    return o1 && o2 ? this.getProductIdentifier(o1) === this.getProductIdentifier(o2) : o1 === o2;
  }

  addProductToCollectionIfMissing<Type extends Pick<Product, 'id'>>(
    productCollection: Type[],
    ...productsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const products: Type[] = productsToCheck.filter(isPresent);
    if (products.length > 0) {
      const productCollectionIdentifiers = productCollection.map(productItem => this.getProductIdentifier(productItem)!);
      const productsToAdd = products.filter(productItem => {
        const productIdentifier = this.getProductIdentifier(productItem);
        if (productCollectionIdentifiers.includes(productIdentifier)) {
          return false;
        }
        productCollectionIdentifiers.push(productIdentifier);
        return true;
      });
      return [...productsToAdd, ...productCollection];
    }
    return productCollection;
  }

  protected convertDateFromClient<T extends Product | NewProduct | PartialUpdateProduct>(product: T): RestOf<T> {
    return {
      ...product,
      lastOrderDate: product.lastOrderDate?.toJSON() ?? null,
      createdDate: product.createdDate?.toJSON() ?? null,
      lastModifiedDate: product.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restProduct: RestProduct): Product {
    return {
      ...restProduct,
      lastOrderDate: restProduct.lastOrderDate ? dayjs(restProduct.lastOrderDate) : undefined,
      createdDate: restProduct.createdDate ? dayjs(restProduct.createdDate) : undefined,
      lastModifiedDate: restProduct.lastModifiedDate ? dayjs(restProduct.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProduct>): HttpResponse<Product> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProduct[]>): HttpResponse<Product[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /***********************************************************************
   *************** from ERM.2
   ***********************************************************************/
  findSummaryProductByOrder(id?: number): Observable<EntityArrayResponseType> {
    return this.http.get<Product[]>(`${this.resourceUrlOrderSummary}/${id}`, { observe: 'response' });
  }

  searchBySupplier(req?: any, id?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Product[]>(`${this.resourceUrlSupplierSearch}/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  findBySupplierId(req?: any, id?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Product[]>(`${this.resourceUrlSupplier}/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Product[]>(this.resourceUrlSearch, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  queryDetail(req?: any): Observable<EntityResponseProductDetailType> {
    const options = createRequestOption(req);
    return this.http
      .get<ProductDetail>(this.resourceDetailUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityResponseProductDetailType) => res));
  }

  findSummaryByIds(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Product[]>(this.resourceUrlSummary, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((product: Product) => {
        product.lastOrderDate = product.lastOrderDate ? dayjs(product.lastOrderDate) : undefined;
        product.lastModifiedDate = product.lastModifiedDate ? dayjs(product.lastModifiedDate) : undefined;
      });
    }
    return res;
  }

  searchDetail(req?: any): Observable<EntityResponseProductDetailType> {
    const options = createRequestOption(req);
    return this.http
      .get<ProductDetail>(`${this.resourceUrlSearch}/detail`, { params: options, observe: 'response' })
      .pipe(map((res: EntityResponseProductDetailType) => res));
  }

  findByInvoiceId(id?: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<Product[]>(`${this.resourceUrl}/invoice/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
}
