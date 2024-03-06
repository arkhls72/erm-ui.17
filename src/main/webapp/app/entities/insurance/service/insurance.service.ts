import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Insurance, NewInsurance } from '../insurance.model';
import { InsuranceClient } from '../../client/insurance-client.model';

export type PartialUpdateInsurance = Partial<Insurance> & Pick<Insurance, 'id'>;

export type EntityResponseType = HttpResponse<Insurance>;
export type EntityArrayResponseType = HttpResponse<Insurance[]>;
export type EntityResposneClientType = HttpResponse<InsuranceClient>;
@Injectable({ providedIn: 'root' })
export class InsuranceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/insurances');
  public resourceUrlClient = this.resourceUrl + '/client';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(insurance: NewInsurance): Observable<EntityResponseType> {
    return this.http.post<Insurance>(this.resourceUrl, insurance, { observe: 'response' });
  }

  update(insurance: Insurance): Observable<EntityResponseType> {
    return this.http.put<Insurance>(`${this.resourceUrl}/${this.getInsuranceIdentifier(insurance)}`, insurance, { observe: 'response' });
  }

  partialUpdate(insurance: PartialUpdateInsurance): Observable<EntityResponseType> {
    return this.http.patch<Insurance>(`${this.resourceUrl}/${this.getInsuranceIdentifier(insurance)}`, insurance, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<Insurance>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Insurance[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInsuranceIdentifier(insurance: Pick<Insurance, 'id'>): number {
    return insurance.id;
  }

  compareInsurance(o1: Pick<Insurance, 'id'> | null, o2: Pick<Insurance, 'id'> | null): boolean {
    return o1 && o2 ? this.getInsuranceIdentifier(o1) === this.getInsuranceIdentifier(o2) : o1 === o2;
  }

  addInsuranceToCollectionIfMissing<Type extends Pick<Insurance, 'id'>>(
    insuranceCollection: Type[],
    ...insurancesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const insurances: Type[] = insurancesToCheck.filter(isPresent);
    if (insurances.length > 0) {
      const insuranceCollectionIdentifiers = insuranceCollection.map(insuranceItem => this.getInsuranceIdentifier(insuranceItem)!);
      const insurancesToAdd = insurances.filter(insuranceItem => {
        const insuranceIdentifier = this.getInsuranceIdentifier(insuranceItem);
        if (insuranceCollectionIdentifiers.includes(insuranceIdentifier)) {
          return false;
        }
        insuranceCollectionIdentifiers.push(insuranceIdentifier);
        return true;
      });
      return [...insurancesToAdd, ...insuranceCollection];
    }
    return insuranceCollection;
  }

  /**
   * ERM.2
   */

  findActiveByClientId(id: number): Observable<EntityResposneClientType> {
    return this.http.get<InsuranceClient>(`${this.resourceUrlClient}/${id}`, { observe: 'response' });
  }
}
