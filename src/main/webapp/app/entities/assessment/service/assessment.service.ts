import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Assessment, NewAssessment } from '../assessment.model';
import { AssessmentSaveEntity } from '../assessment-save-entity.model';

export type PartialUpdateAssessment = Partial<Assessment> & Pick<Assessment, 'id'>;

type RestOf<T extends Assessment | NewAssessment> = Omit<T, 'lastModifiedDate'> & {
  lastModifiedDate?: string | null;
};

export type RestAssessment = RestOf<Assessment>;

export type NewRestAssessment = RestOf<NewAssessment>;

export type PartialUpdateRestAssessment = RestOf<PartialUpdateAssessment>;

export type EntityResponseType = HttpResponse<Assessment>;
export type EntityArrayResponseType = HttpResponse<Assessment[]>;

@Injectable({ providedIn: 'root' })
export class AssessmentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/assessments');
  public resourceUrlClient = this.resourceUrl + '/client';
  public resourceUrlSearch = this.resourceUrl + '/_search/client/';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(assessment: NewAssessment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assessment);
    return this.http
      .post<RestAssessment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(assessment: Assessment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assessment);
    return this.http
      .put<RestAssessment>(`${this.resourceUrl}/${this.getAssessmentIdentifier(assessment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(assessment: PartialUpdateAssessment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assessment);
    return this.http
      .patch<RestAssessment>(`${this.resourceUrl}/${this.getAssessmentIdentifier(assessment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAssessment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAssessment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAssessmentIdentifier(assessment: Pick<Assessment, 'id'>): number {
    return assessment.id;
  }

  compareAssessment(o1: Pick<Assessment, 'id'> | null, o2: Pick<Assessment, 'id'> | null): boolean {
    return o1 && o2 ? this.getAssessmentIdentifier(o1) === this.getAssessmentIdentifier(o2) : o1 === o2;
  }

  addAssessmentToCollectionIfMissing<Type extends Pick<Assessment, 'id'>>(
    assessmentCollection: Type[],
    ...assessmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const assessments: Type[] = assessmentsToCheck.filter(isPresent);
    if (assessments.length > 0) {
      const assessmentCollectionIdentifiers = assessmentCollection.map(assessmentItem => this.getAssessmentIdentifier(assessmentItem)!);
      const assessmentsToAdd = assessments.filter(assessmentItem => {
        const assessmentIdentifier = this.getAssessmentIdentifier(assessmentItem);
        if (assessmentCollectionIdentifiers.includes(assessmentIdentifier)) {
          return false;
        }
        assessmentCollectionIdentifiers.push(assessmentIdentifier);
        return true;
      });
      return [...assessmentsToAdd, ...assessmentCollection];
    }
    return assessmentCollection;
  }

  protected convertDateFromClient<T extends Assessment | NewAssessment | PartialUpdateAssessment>(assessment: T): RestOf<T> {
    return {
      ...assessment,
      lastModifiedDate: assessment.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAssessment: RestAssessment | Assessment): Assessment {
    return {
      ...restAssessment,
      lastModifiedDate: restAssessment.lastModifiedDate ? dayjs(restAssessment.lastModifiedDate) : undefined,
    };
  }

  searchByClientId(req?: any, id?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Assessment[]>(`${this.resourceUrlSearch}/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  findByClientPaginated(req?: any, id?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Assessment[]>(`${this.resourceUrlClient}/${id}/page`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertResponseFromServer(res: HttpResponse<RestAssessment> | HttpResponse<Assessment>): HttpResponse<Assessment> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAssessment[]>): HttpResponse<Assessment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  createForClient(assessment?: AssessmentSaveEntity, clientId?: number): Observable<EntityResponseType> {
    const copy = assessment;
    return this.http
      .post<Assessment>(`${this.resourceUrlClient}/${clientId}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }
  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((assessment: Assessment) => {
        assessment.lastModifiedDate = assessment.lastModifiedDate ? dayjs(assessment.lastModifiedDate) : undefined;
        assessment.createdDate = assessment.createdDate ? dayjs(assessment.createdDate) : undefined;
      });
    }
    return res;
  }
  findByClient(id?: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<Assessment[]>(`${this.resourceUrlClient}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  findSummaryByClient(req?: any, id?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Assessment[]>(`${this.resourceUrl}/summary/client/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  findShortByClientBySoapNote(id?: number, soapNoteId?: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<Assessment[]>(`${this.resourceUrl}/client/${id}/soapnote/${soapNoteId}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  findShortListSummaryByClient(id?: any): Observable<EntityArrayResponseType> {
    return this.http
      .get<Assessment[]>(`${this.resourceUrl}/short/client/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
}
