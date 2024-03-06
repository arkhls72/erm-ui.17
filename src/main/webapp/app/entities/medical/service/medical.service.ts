import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Medical, NewMedical } from '../medical.model';
import { MedicalCondition } from '../medicalCondition.model';
import { MedicalClient } from '../../client/client-medical-tab/medical-client.model';

export type PartialUpdateMedical = Partial<Medical> & Pick<Medical, 'id'>;

export type EntityResponseType = HttpResponse<Medical>;
export type EntityArrayResponseType = HttpResponse<Medical[]>;
type EntityMedicalClientResponseType = HttpResponse<MedicalClient>;

@Injectable({ providedIn: 'root' })
export class MedicalService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/medicals');
  public resourceUrlCondition = SERVER_API_URL + 'api/medicals/conditions';
  public resourceUrlClient = this.resourceUrl + '/client';

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(medical: NewMedical): Observable<EntityResponseType> {
    return this.http.post<Medical>(this.resourceUrl, medical, { observe: 'response' });
  }

  update(medical: Medical): Observable<EntityResponseType> {
    return this.http.put<Medical>(`${this.resourceUrl}/${this.getMedicalIdentifier(medical)}`, medical, { observe: 'response' });
  }

  partialUpdate(medical: PartialUpdateMedical): Observable<EntityResponseType> {
    return this.http.patch<Medical>(`${this.resourceUrl}/${this.getMedicalIdentifier(medical)}`, medical, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<Medical>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Medical[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMedicalIdentifier(medical: Pick<Medical, 'id'>): number {
    return medical.id;
  }

  compareMedical(o1: Pick<Medical, 'id'> | null, o2: Pick<Medical, 'id'> | null): boolean {
    return o1 && o2 ? this.getMedicalIdentifier(o1) === this.getMedicalIdentifier(o2) : o1 === o2;
  }

  addMedicalToCollectionIfMissing<Type extends Pick<Medical, 'id'>>(
    medicalCollection: Type[],
    ...medicalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const medicals: Type[] = medicalsToCheck.filter(isPresent);
    if (medicals.length > 0) {
      const medicalCollectionIdentifiers = medicalCollection.map(medicalItem => this.getMedicalIdentifier(medicalItem)!);
      const medicalsToAdd = medicals.filter(medicalItem => {
        const medicalIdentifier = this.getMedicalIdentifier(medicalItem);
        if (medicalCollectionIdentifiers.includes(medicalIdentifier)) {
          return false;
        }
        medicalCollectionIdentifiers.push(medicalIdentifier);
        return true;
      });
      return [...medicalsToAdd, ...medicalCollection];
    }
    return medicalCollection;
  }

  /**
   * ERM.2
   */

  createByConditionIds(medicalCondition: MedicalCondition): Observable<EntityMedicalClientResponseType> {
    return this.http.post<MedicalClient>(this.resourceUrlCondition, medicalCondition, { observe: 'response' });
  }

  findByClientId(id: number): Observable<EntityResponseType> {
    return this.http.get<Medical>(`${this.resourceUrl}/client/${id}`, { observe: 'response' });
  }

  deleteConditionByClientId(clientId: number, conditionId: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/client/condition/${clientId}/${conditionId}`, { observe: 'response' });
  }

  deleteMedicationByClientId(clientId: number, medicationId: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/client/medication/${clientId}/${medicationId}`, { observe: 'response' });
  }

  deleteInjuryByClientId(clientId: number, injuryId: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/client/injury/${clientId}/${injuryId}`, { observe: 'response' });
  }

  deleteOperationByClientId(clientId: number, operationId: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/client/operation/${clientId}/${operationId}`, { observe: 'response' });
  }
}
