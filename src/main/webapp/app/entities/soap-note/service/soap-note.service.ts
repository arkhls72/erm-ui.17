import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SoapNote, NewSoapNote } from '../soap-note.model';

export type PartialUpdateSoapNote = Partial<SoapNote> & Pick<SoapNote, 'id'>;

type RestOf<T extends SoapNote | NewSoapNote> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestSoapNote = RestOf<SoapNote>;

export type NewRestSoapNote = RestOf<NewSoapNote>;

export type PartialUpdateRestSoapNote = RestOf<PartialUpdateSoapNote>;

export type EntityResponseType = HttpResponse<SoapNote>;
export type EntityArrayResponseType = HttpResponse<SoapNote[]>;

@Injectable({ providedIn: 'root' })
export class SoapNoteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/soap-notes');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(soapNote: NewSoapNote | SoapNote): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(soapNote);
    return this.http
      .post<RestSoapNote>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(soapNote: SoapNote): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(soapNote);
    return this.http
      .put<RestSoapNote>(`${this.resourceUrl}/${this.getSoapNoteIdentifier(soapNote)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(soapNote: PartialUpdateSoapNote): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(soapNote);
    return this.http
      .patch<RestSoapNote>(`${this.resourceUrl}/${this.getSoapNoteIdentifier(soapNote)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSoapNote>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSoapNote[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSoapNoteIdentifier(soapNote: Pick<SoapNote, 'id'>): number {
    return <number>soapNote.id;
  }

  compareSoapNote(o1: Pick<SoapNote, 'id'> | null, o2: Pick<SoapNote, 'id'> | null): boolean {
    return o1 && o2 ? this.getSoapNoteIdentifier(o1) === this.getSoapNoteIdentifier(o2) : o1 === o2;
  }

  addSoapNoteToCollectionIfMissing<Type extends Pick<SoapNote, 'id'>>(
    soapNoteCollection: Type[],
    ...soapNotesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const soapNotes: Type[] = soapNotesToCheck.filter(isPresent);
    if (soapNotes.length > 0) {
      const soapNoteCollectionIdentifiers = soapNoteCollection.map(soapNoteItem => this.getSoapNoteIdentifier(soapNoteItem)!);
      const soapNotesToAdd = soapNotes.filter(soapNoteItem => {
        const soapNoteIdentifier = this.getSoapNoteIdentifier(soapNoteItem);
        if (soapNoteCollectionIdentifiers.includes(soapNoteIdentifier)) {
          return false;
        }
        soapNoteCollectionIdentifiers.push(soapNoteIdentifier);
        return true;
      });
      return [...soapNotesToAdd, ...soapNoteCollection];
    }
    return soapNoteCollection;
  }

  protected convertDateFromClient<T extends SoapNote | NewSoapNote | PartialUpdateSoapNote>(soapNote: T): RestOf<T> {
    return {
      ...soapNote,
      createdDate: soapNote.createdDate?.toJSON() ?? null,
      lastModifiedDate: soapNote.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restSoapNote: RestSoapNote): SoapNote {
    return {
      ...restSoapNote,
      createdDate: restSoapNote.createdDate ? dayjs(restSoapNote.createdDate) : undefined,
      lastModifiedDate: restSoapNote.lastModifiedDate ? dayjs(restSoapNote.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSoapNote>): HttpResponse<SoapNote> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSoapNote[]>): HttpResponse<SoapNote[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERM.2
   */

  findQueryByClientId(req?: any, id?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<SoapNote[]>(`${this.resourceUrl}/client/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((soapnote: SoapNote) => {
        soapnote.createdDate = soapnote.createdDate ? dayjs(soapnote.createdDate) : undefined;
        soapnote.lastModifiedDate = soapnote.lastModifiedDate ? dayjs(soapnote.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
