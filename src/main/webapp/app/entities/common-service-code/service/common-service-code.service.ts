import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { CommonServiceCode, NewCommonServiceCode } from '../common-service-code.model';

export type PartialUpdateCommonServiceCode = Partial<CommonServiceCode> & Pick<CommonServiceCode, 'id'>;

export type EntityResponseType = HttpResponse<CommonServiceCode>;
export type EntityArrayResponseType = HttpResponse<CommonServiceCode[]>;

@Injectable({ providedIn: 'root' })
export class CommonServiceCodeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/common-service-codes');
  public resourceUrlSearch = this.resourceUrl + '/_search';

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(commonServiceCode: NewCommonServiceCode): Observable<EntityResponseType> {
    return this.http.post<CommonServiceCode>(this.resourceUrl, commonServiceCode, { observe: 'response' });
  }

  update(commonServiceCode: CommonServiceCode): Observable<EntityResponseType> {
    return this.http.put<CommonServiceCode>(
      `${this.resourceUrl}/${this.getCommonServiceCodeIdentifier(commonServiceCode)}`,
      commonServiceCode,
      { observe: 'response' },
    );
  }

  partialUpdate(commonServiceCode: PartialUpdateCommonServiceCode): Observable<EntityResponseType> {
    return this.http.patch<CommonServiceCode>(
      `${this.resourceUrl}/${this.getCommonServiceCodeIdentifier(commonServiceCode)}`,
      commonServiceCode,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<CommonServiceCode>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<CommonServiceCode[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCommonServiceCodeIdentifier(commonServiceCode: Pick<CommonServiceCode, 'id'>): number {
    return commonServiceCode.id;
  }

  compareCommonServiceCode(o1: Pick<CommonServiceCode, 'id'> | null, o2: Pick<CommonServiceCode, 'id'> | null): boolean {
    return o1 && o2 ? this.getCommonServiceCodeIdentifier(o1) === this.getCommonServiceCodeIdentifier(o2) : o1 === o2;
  }

  addCommonServiceCodeToCollectionIfMissing<Type extends Pick<CommonServiceCode, 'id'>>(
    commonServiceCodeCollection: Type[],
    ...commonServiceCodesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const commonServiceCodes: Type[] = commonServiceCodesToCheck.filter(isPresent);
    if (commonServiceCodes.length > 0) {
      const commonServiceCodeCollectionIdentifiers = commonServiceCodeCollection.map(
        commonServiceCodeItem => this.getCommonServiceCodeIdentifier(commonServiceCodeItem)!,
      );
      const commonServiceCodesToAdd = commonServiceCodes.filter(commonServiceCodeItem => {
        const commonServiceCodeIdentifier = this.getCommonServiceCodeIdentifier(commonServiceCodeItem);
        if (commonServiceCodeCollectionIdentifiers.includes(commonServiceCodeIdentifier)) {
          return false;
        }
        commonServiceCodeCollectionIdentifiers.push(commonServiceCodeIdentifier);
        return true;
      });
      return [...commonServiceCodesToAdd, ...commonServiceCodeCollection];
    }
    return commonServiceCodeCollection;
  }

  /**
   * ERM.2
   */
  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<CommonServiceCode[]>(this.resourceUrlSearch, { params: options, observe: 'response' });
  }
}
