import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ProgNote, NewProgNote } from '../prog-note.model';

export type PartialUpdateProgNote = Partial<ProgNote> & Pick<ProgNote, 'id'>;

type RestOf<T extends ProgNote | NewProgNote> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestProgNote = RestOf<ProgNote>;

export type NewRestProgNote = RestOf<NewProgNote>;

export type PartialUpdateRestProgNote = RestOf<PartialUpdateProgNote>;

export type EntityResponseType = HttpResponse<ProgNote>;
export type EntityArrayResponseType = HttpResponse<ProgNote[]>;

@Injectable({ providedIn: 'root' })
export class ProgNoteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/prog-notes');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(progNote: NewProgNote | ProgNote): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(progNote);
    return this.http
      .post<RestProgNote>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(progNote: ProgNote): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(progNote);
    return this.http
      .put<RestProgNote>(`${this.resourceUrl}/${this.getProgNoteIdentifier(progNote)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(progNote: PartialUpdateProgNote): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(progNote);
    return this.http
      .patch<RestProgNote>(`${this.resourceUrl}/${this.getProgNoteIdentifier(progNote)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProgNote>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProgNote[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProgNoteIdentifier(progNote: Pick<ProgNote, 'id'>): number {
    return progNote.id;
  }

  compareProgNote(o1: Pick<ProgNote, 'id'> | null, o2: Pick<ProgNote, 'id'> | null): boolean {
    return o1 && o2 ? this.getProgNoteIdentifier(o1) === this.getProgNoteIdentifier(o2) : o1 === o2;
  }

  addProgNoteToCollectionIfMissing<Type extends Pick<ProgNote, 'id'>>(
    progNoteCollection: Type[],
    ...progNotesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const progNotes: Type[] = progNotesToCheck.filter(isPresent);
    if (progNotes.length > 0) {
      const progNoteCollectionIdentifiers = progNoteCollection.map(progNoteItem => this.getProgNoteIdentifier(progNoteItem)!);
      const progNotesToAdd = progNotes.filter(progNoteItem => {
        const progNoteIdentifier = this.getProgNoteIdentifier(progNoteItem);
        if (progNoteCollectionIdentifiers.includes(progNoteIdentifier)) {
          return false;
        }
        progNoteCollectionIdentifiers.push(progNoteIdentifier);
        return true;
      });
      return [...progNotesToAdd, ...progNoteCollection];
    }
    return progNoteCollection;
  }

  protected convertDateFromClient<T extends ProgNote | NewProgNote | PartialUpdateProgNote>(progNote: T): RestOf<T> {
    return {
      ...progNote,
      createdDate: progNote.createdDate?.toJSON() ?? null,
      lastModifiedDate: progNote.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restProgNote: RestProgNote): ProgNote {
    return {
      ...restProgNote,
      createdDate: restProgNote.createdDate ? dayjs(restProgNote.createdDate) : undefined,
      lastModifiedDate: restProgNote.lastModifiedDate ? dayjs(restProgNote.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProgNote>): HttpResponse<ProgNote> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProgNote[]>): HttpResponse<ProgNote[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  findByProgId(id?: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<ProgNote[]>(`${this.resourceUrl}/prog/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((progNote: ProgNote) => {
        progNote.createdDate = progNote.createdDate ? dayjs(progNote.createdDate) : undefined;
        progNote.lastModifiedDate = progNote.lastModifiedDate ? dayjs(progNote.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
