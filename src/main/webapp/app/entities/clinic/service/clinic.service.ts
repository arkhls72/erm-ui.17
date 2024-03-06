import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Clinic, NewClinic } from '../clinic.model';

export type PartialUpdateClinic = Partial<Clinic> & Pick<Clinic, 'id'>;

type RestOf<T extends Clinic | NewClinic> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestClinic = RestOf<Clinic>;

export type NewRestClinic = RestOf<NewClinic>;

export type PartialUpdateRestClinic = RestOf<PartialUpdateClinic>;

export type EntityResponseType = HttpResponse<Clinic>;
export type EntityArrayResponseType = HttpResponse<Clinic[]>;

@Injectable({ providedIn: 'root' })
export class ClinicService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/clinics');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(clinic: NewClinic): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clinic);
    return this.http
      .post<RestClinic>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(clinic: Clinic): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clinic);
    return this.http
      .put<RestClinic>(`${this.resourceUrl}/${this.getClinicIdentifier(clinic)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(clinic: PartialUpdateClinic): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clinic);
    return this.http
      .patch<RestClinic>(`${this.resourceUrl}/${this.getClinicIdentifier(clinic)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestClinic>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestClinic[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getClinicIdentifier(clinic: Pick<Clinic, 'id'>): number {
    return clinic.id;
  }

  compareClinic(o1: Pick<Clinic, 'id'> | null, o2: Pick<Clinic, 'id'> | null): boolean {
    return o1 && o2 ? this.getClinicIdentifier(o1) === this.getClinicIdentifier(o2) : o1 === o2;
  }

  addClinicToCollectionIfMissing<Type extends Pick<Clinic, 'id'>>(
    clinicCollection: Type[],
    ...clinicsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const clinics: Type[] = clinicsToCheck.filter(isPresent);
    if (clinics.length > 0) {
      const clinicCollectionIdentifiers = clinicCollection.map(clinicItem => this.getClinicIdentifier(clinicItem)!);
      const clinicsToAdd = clinics.filter(clinicItem => {
        const clinicIdentifier = this.getClinicIdentifier(clinicItem);
        if (clinicCollectionIdentifiers.includes(clinicIdentifier)) {
          return false;
        }
        clinicCollectionIdentifiers.push(clinicIdentifier);
        return true;
      });
      return [...clinicsToAdd, ...clinicCollection];
    }
    return clinicCollection;
  }

  protected convertDateFromClient<T extends Clinic | NewClinic | PartialUpdateClinic>(clinic: T): RestOf<T> {
    return {
      ...clinic,
      createdDate: clinic.createdDate?.toJSON() ?? null,
      lastModifiedDate: clinic.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restClinic: RestClinic): Clinic {
    return {
      ...restClinic,
      createdDate: restClinic.createdDate ? dayjs(restClinic.createdDate) : undefined,
      lastModifiedDate: restClinic.lastModifiedDate ? dayjs(restClinic.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestClinic>): HttpResponse<Clinic> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestClinic[]>): HttpResponse<Clinic[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
