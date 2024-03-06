import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Address, NewAddress } from '../address.model';
import { AssessmentSaveEntity } from '../../assessment/assessment-save-entity.model';
import { Assessment } from '../../assessment/assessment.model';

export type PartialUpdateAddress = Partial<Address> & Pick<Address, 'id'>;

type RestOf<T extends Address | NewAddress> = Omit<T, 'lastModifiedDate' | 'createdDate'> & {
  lastModifiedDate?: string | null;
  createdDate?: string | null;
};

export type RestAddress = RestOf<Address>;

export type NewRestAddress = RestOf<NewAddress>;

export type PartialUpdateRestAddress = RestOf<PartialUpdateAddress>;

export type EntityResponseType = HttpResponse<Address>;
export type EntityArrayResponseType = HttpResponse<Address[]>;

@Injectable({ providedIn: 'root' })
export class AddressService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/addresses');
  public resourceUrlSupplier = this.resourceUrl + '/supplier';
  public resourceUrlEhc = this.resourceUrl + '/ehc';
  public resourceUrlMva = this.resourceUrl + '/mva';
  public resourceUrlWsib = this.resourceUrl + '/wsib';
  public resourceUrlClient = this.resourceUrl + '/client';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(address: NewAddress): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(address);
    return this.http
      .post<RestAddress>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(address: Address): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(address);
    return this.http
      .put<RestAddress>(`${this.resourceUrl}/${this.getAddressIdentifier(address)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(address: PartialUpdateAddress): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(address);
    return this.http
      .patch<RestAddress>(`${this.resourceUrl}/${this.getAddressIdentifier(address)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAddress>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAddress[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAddressIdentifier(address: Pick<Address, 'id'>): number {
    return address.id;
  }

  compareAddress(o1: Pick<Address, 'id'> | null, o2: Pick<Address, 'id'> | null): boolean {
    return o1 && o2 ? this.getAddressIdentifier(o1) === this.getAddressIdentifier(o2) : o1 === o2;
  }

  addAddressToCollectionIfMissing<Type extends Pick<Address, 'id'>>(
    addressCollection: Type[],
    ...addressesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const addresses: Type[] = addressesToCheck.filter(isPresent);
    if (addresses.length > 0) {
      const addressCollectionIdentifiers = addressCollection.map(addressItem => this.getAddressIdentifier(addressItem)!);
      const addressesToAdd = addresses.filter(addressItem => {
        const addressIdentifier = this.getAddressIdentifier(addressItem);
        if (addressCollectionIdentifiers.includes(addressIdentifier)) {
          return false;
        }
        addressCollectionIdentifiers.push(addressIdentifier);
        return true;
      });
      return [...addressesToAdd, ...addressCollection];
    }
    return addressCollection;
  }

  protected convertDateFromClient<T extends Address | NewAddress | PartialUpdateAddress>(address: T): RestOf<T> {
    return {
      ...address,
      lastModifiedDate: address.lastModifiedDate?.toJSON() ?? null,
      createdDate: address.createdDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAddress: RestAddress | Address): Address {
    return {
      ...restAddress,
      lastModifiedDate: restAddress.lastModifiedDate ? dayjs(restAddress.lastModifiedDate) : undefined,
      createdDate: restAddress.createdDate ? dayjs(restAddress.createdDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAddress> | HttpResponse<Address>): HttpResponse<Address> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAddress[]>): HttpResponse<Address[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /******************************************************************************************************
   *  ERM.2
   ******************************************************************************************************/
  createForSupplier(address: Address, id: number): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(address);
    return this.http
      .post<RestAddress>(`${this.resourceUrlSupplier}/${id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  createForMva(address: Address, id: number): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(address);
    return this.http
      .post<RestAddress>(`${this.resourceUrlMva}/${id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  createForWsib(address: Address, id: number): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(address);
    return this.http
      .post<Address>(`${this.resourceUrlWsib}/${id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  createForClient(assessment?: AssessmentSaveEntity, clientId?: number): Observable<EntityResponseType> {
    const copy = assessment;
    return this.http
      .post<Assessment>(`${this.resourceUrlClient}/${clientId}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  createForEhc(address: Address, id: number): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(address);
    return this.http
      .post<Address>(`${this.resourceUrlEhc}/${id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  updateForSupplier(address: Address, id: number): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(address);
    return this.http
      .put<RestAddress>(`${this.resourceUrlSupplier}/${id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  updateForEhc(address: Address, id: number): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(address);
    return this.http
      .put<Address>(`${this.resourceUrlEhc}/${id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  updateForMva(address: Address, id: number): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(address);
    return this.http
      .put<RestAddress>(`${this.resourceUrlMva}/${id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  updateForWsib(address: Address, id: number): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(address);
    return this.http
      .put<Address>(`${this.resourceUrlWsib}/${id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }
  updateForClient(address: Address, id: number): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(address);
    return this.http
      .put<Address>(`${this.resourceUrlClient}/${id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }
}
