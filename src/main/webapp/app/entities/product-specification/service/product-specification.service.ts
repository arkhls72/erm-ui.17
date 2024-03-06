import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ProductSpecification, NewProductSpecification } from '../product-specification.model';

export type PartialUpdateProductSpecification = Partial<ProductSpecification> & Pick<ProductSpecification, 'id'>;

type RestOf<T extends ProductSpecification | NewProductSpecification> = Omit<T, 'lastModifiedDate' | 'createdDate'> & {
  lastModifiedDate?: string | null;
  createdDate?: string | null;
};

export type RestProductSpecification = RestOf<ProductSpecification>;

export type NewRestProductSpecification = RestOf<NewProductSpecification>;

export type PartialUpdateRestProductSpecification = RestOf<PartialUpdateProductSpecification>;

export type EntityResponseType = HttpResponse<ProductSpecification>;
export type EntityArrayResponseType = HttpResponse<ProductSpecification[]>;

@Injectable({ providedIn: 'root' })
export class ProductSpecificationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/product-specifications');
  protected resourceUrlProduct = this.resourceUrl + '/product';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(productSpecification: ProductSpecification): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productSpecification);
    return this.http
      .post<RestProductSpecification>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(productSpecification: ProductSpecification): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productSpecification);
    return this.http
      .put<RestProductSpecification>(`${this.resourceUrl}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(productSpecification: PartialUpdateProductSpecification): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productSpecification);
    return this.http
      .patch<RestProductSpecification>(`${this.resourceUrl}/${this.getProductSpecificationIdentifier(productSpecification)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProductSpecification>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProductSpecification[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProductSpecificationIdentifier(productSpecification: Pick<ProductSpecification, 'id'>): number {
    return productSpecification.id;
  }

  compareProductSpecification(o1: Pick<ProductSpecification, 'id'> | null, o2: Pick<ProductSpecification, 'id'> | null): boolean {
    return o1 && o2 ? this.getProductSpecificationIdentifier(o1) === this.getProductSpecificationIdentifier(o2) : o1 === o2;
  }

  addProductSpecificationToCollectionIfMissing<Type extends Pick<ProductSpecification, 'id'>>(
    productSpecificationCollection: Type[],
    ...productSpecificationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const productSpecifications: Type[] = productSpecificationsToCheck.filter(isPresent);
    if (productSpecifications.length > 0) {
      const productSpecificationCollectionIdentifiers = productSpecificationCollection.map(
        productSpecificationItem => this.getProductSpecificationIdentifier(productSpecificationItem)!,
      );
      const productSpecificationsToAdd = productSpecifications.filter(productSpecificationItem => {
        const productSpecificationIdentifier = this.getProductSpecificationIdentifier(productSpecificationItem);
        if (productSpecificationCollectionIdentifiers.includes(productSpecificationIdentifier)) {
          return false;
        }
        productSpecificationCollectionIdentifiers.push(productSpecificationIdentifier);
        return true;
      });
      return [...productSpecificationsToAdd, ...productSpecificationCollection];
    }
    return productSpecificationCollection;
  }

  protected convertDateFromClient<T extends ProductSpecification | NewProductSpecification | PartialUpdateProductSpecification>(
    productSpecification: T,
  ): RestOf<T> {
    return {
      ...productSpecification,
      lastModifiedDate: productSpecification.lastModifiedDate?.toJSON() ?? null,
      createdDate: productSpecification.createdDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restProductSpecification: RestProductSpecification): ProductSpecification {
    return {
      ...restProductSpecification,
      lastModifiedDate: restProductSpecification.lastModifiedDate ? dayjs(restProductSpecification.lastModifiedDate) : undefined,
      createdDate: restProductSpecification.createdDate ? dayjs(restProductSpecification.createdDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProductSpecification>): HttpResponse<ProductSpecification> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProductSpecification[]>): HttpResponse<ProductSpecification[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**********************************************************************************************
   *from ERM.2
   **********************************************************************************************/

  findByProduct(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProductSpecification>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }
}
