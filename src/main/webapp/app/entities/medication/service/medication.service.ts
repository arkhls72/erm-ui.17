import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Medication, NewMedication } from '../medication.model';

export type PartialUpdateMedication = Partial<Medication> & Pick<Medication, 'id'>;

type RestOf<T extends Medication | NewMedication> = Omit<T, 'startDate' | 'endDate' | 'createdDate' | 'lastModifiedDate'> & {
  startDate?: string | null;
  endDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestMedication = RestOf<Medication>;

export type NewRestMedication = RestOf<NewMedication>;

export type PartialUpdateRestMedication = RestOf<PartialUpdateMedication>;

export type EntityResponseType = HttpResponse<Medication>;
export type EntityArrayResponseType = HttpResponse<Medication[]>;

@Injectable({ providedIn: 'root' })
export class MedicationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/medications');
  public resourceUrlClient = this.resourceUrl + '/client';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(medication: NewMedication): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(medication);
    return this.http
      .post<RestMedication>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(medication: Medication): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(medication);
    return this.http
      .put<RestMedication>(`${this.resourceUrl}/${this.getMedicationIdentifier(medication)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(medication: PartialUpdateMedication): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(medication);
    return this.http
      .patch<RestMedication>(`${this.resourceUrl}/${this.getMedicationIdentifier(medication)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMedication>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMedication[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMedicationIdentifier(medication: Pick<Medication, 'id'>): number {
    return medication.id;
  }

  compareMedication(o1: Pick<Medication, 'id'> | null, o2: Pick<Medication, 'id'> | null): boolean {
    return o1 && o2 ? this.getMedicationIdentifier(o1) === this.getMedicationIdentifier(o2) : o1 === o2;
  }

  addMedicationToCollectionIfMissing<Type extends Pick<Medication, 'id'>>(
    medicationCollection: Type[],
    ...medicationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const medications: Type[] = medicationsToCheck.filter(isPresent);
    if (medications.length > 0) {
      const medicationCollectionIdentifiers = medicationCollection.map(medicationItem => this.getMedicationIdentifier(medicationItem)!);
      const medicationsToAdd = medications.filter(medicationItem => {
        const medicationIdentifier = this.getMedicationIdentifier(medicationItem);
        if (medicationCollectionIdentifiers.includes(medicationIdentifier)) {
          return false;
        }
        medicationCollectionIdentifiers.push(medicationIdentifier);
        return true;
      });
      return [...medicationsToAdd, ...medicationCollection];
    }
    return medicationCollection;
  }

  protected convertDateFromClient<T extends Medication | NewMedication | PartialUpdateMedication>(medication: T): RestOf<T> {
    return {
      ...medication,
      startDate: medication.startDate?.toJSON() ?? null,
      endDate: medication.endDate?.toJSON() ?? null,
      createdDate: medication.createdDate?.toJSON() ?? null,
      lastModifiedDate: medication.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restMedication: Medication | RestMedication): Medication {
    return {
      ...restMedication,
      startDate: restMedication.startDate ? dayjs(restMedication.startDate) : undefined,
      endDate: restMedication.endDate ? dayjs(restMedication.endDate) : undefined,
      createdDate: restMedication.createdDate ? dayjs(restMedication.createdDate) : undefined,
      lastModifiedDate: restMedication.lastModifiedDate ? dayjs(restMedication.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMedication> | HttpResponse<Medication>): HttpResponse<Medication> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMedication[]>): HttpResponse<Medication[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERM2
   */
  findByClientId(id: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<Medication[]>(`${this.resourceUrlClient}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((medication: Medication) => {
        medication.startDate = medication.startDate ? dayjs(medication.startDate) : undefined;
        medication.endDate = medication.endDate ? dayjs(medication.endDate) : undefined;
        medication.lastModifiedDate = medication.lastModifiedDate ? dayjs(medication.lastModifiedDate) : undefined;
      });
    }
    return res;
  }

  protected convertDateFromResponeServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate ? dayjs(res.body.startDate) : undefined;
      res.body.endDate = res.body.endDate ? dayjs(res.body.endDate) : undefined;
      res.body.lastModifiedDate = res.body.lastModifiedDate ? dayjs(res.body.lastModifiedDate) : undefined;
    }
    return res;
  }
  createForClient(medication: Medication, clientId: number): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(medication);
    return this.http
      .post<Medication>(`${this.resourceUrl}/client/${clientId}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertDateFromResponeServer(res)));
  }
}
