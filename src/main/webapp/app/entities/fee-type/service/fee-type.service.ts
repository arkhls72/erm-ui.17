import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { FeeType, NewFeeType } from '../fee-type.model';

export type PartialUpdateFeeType = Partial<FeeType> & Pick<FeeType, 'id'>;

export type EntityResponseType = HttpResponse<FeeType>;
export type EntityArrayResponseType = HttpResponse<FeeType[]>;

@Injectable({ providedIn: 'root' })
export class FeeTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fee-types');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(feeType: NewFeeType): Observable<EntityResponseType> {
    return this.http.post<FeeType>(this.resourceUrl, feeType, { observe: 'response' });
  }

  update(feeType: FeeType): Observable<EntityResponseType> {
    return this.http.put<FeeType>(`${this.resourceUrl}/${this.getFeeTypeIdentifier(feeType)}`, feeType, { observe: 'response' });
  }

  partialUpdate(feeType: PartialUpdateFeeType): Observable<EntityResponseType> {
    return this.http.patch<FeeType>(`${this.resourceUrl}/${this.getFeeTypeIdentifier(feeType)}`, feeType, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<FeeType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<FeeType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFeeTypeIdentifier(feeType: Pick<FeeType, 'id'>): number {
    return feeType.id;
  }

  compareFeeType(o1: Pick<FeeType, 'id'> | null, o2: Pick<FeeType, 'id'> | null): boolean {
    return o1 && o2 ? this.getFeeTypeIdentifier(o1) === this.getFeeTypeIdentifier(o2) : o1 === o2;
  }

  addFeeTypeToCollectionIfMissing<Type extends Pick<FeeType, 'id'>>(
    feeTypeCollection: Type[],
    ...feeTypesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const feeTypes: Type[] = feeTypesToCheck.filter(isPresent);
    if (feeTypes.length > 0) {
      const feeTypeCollectionIdentifiers = feeTypeCollection.map(feeTypeItem => this.getFeeTypeIdentifier(feeTypeItem)!);
      const feeTypesToAdd = feeTypes.filter(feeTypeItem => {
        const feeTypeIdentifier = this.getFeeTypeIdentifier(feeTypeItem);
        if (feeTypeCollectionIdentifiers.includes(feeTypeIdentifier)) {
          return false;
        }
        feeTypeCollectionIdentifiers.push(feeTypeIdentifier);
        return true;
      });
      return [...feeTypesToAdd, ...feeTypeCollection];
    }
    return feeTypeCollection;
  }

  /*********************
   *  ERM.2
   */

  queryAll(): Observable<EntityArrayResponseType> {
    return this.http.get<FeeType[]>(this.resourceUrl, { observe: 'response' });
  }
}
