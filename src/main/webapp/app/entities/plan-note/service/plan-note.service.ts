import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { PlanNote, NewPlanNote } from '../plan-note.model';

export type PartialUpdatePlanNote = Partial<PlanNote> & Pick<PlanNote, 'id'>;

type RestOf<T extends PlanNote | NewPlanNote> = Omit<T, 'createdDate' | 'lastModfiedDate'> & {
  createdDate?: string | null;
  lastModfiedDate?: string | null;
};

export type RestPlanNote = RestOf<PlanNote>;

export type NewRestPlanNote = RestOf<NewPlanNote>;

export type PartialUpdateRestPlanNote = RestOf<PartialUpdatePlanNote>;

export type EntityResponseType = HttpResponse<PlanNote>;
export type EntityArrayResponseType = HttpResponse<PlanNote[]>;

@Injectable({ providedIn: 'root' })
export class PlanNoteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/plan-notes');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(planNote: PlanNote): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(planNote);
    return this.http
      .post<RestPlanNote>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(planNote: PlanNote): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(planNote);
    return this.http
      .put<RestPlanNote>(`${this.resourceUrl}/${this.getPlanNoteIdentifier(planNote)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(planNote: PartialUpdatePlanNote): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(planNote);
    return this.http
      .patch<RestPlanNote>(`${this.resourceUrl}/${this.getPlanNoteIdentifier(planNote)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPlanNote>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPlanNote[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPlanNoteIdentifier(planNote: Pick<PlanNote, 'id'>): number {
    return planNote.id;
  }

  comparePlanNote(o1: Pick<PlanNote, 'id'> | null, o2: Pick<PlanNote, 'id'> | null): boolean {
    return o1 && o2 ? this.getPlanNoteIdentifier(o1) === this.getPlanNoteIdentifier(o2) : o1 === o2;
  }

  addPlanNoteToCollectionIfMissing<Type extends Pick<PlanNote, 'id'>>(
    planNoteCollection: Type[],
    ...planNotesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const planNotes: Type[] = planNotesToCheck.filter(isPresent);
    if (planNotes.length > 0) {
      const planNoteCollectionIdentifiers = planNoteCollection.map(planNoteItem => this.getPlanNoteIdentifier(planNoteItem)!);
      const planNotesToAdd = planNotes.filter(planNoteItem => {
        const planNoteIdentifier = this.getPlanNoteIdentifier(planNoteItem);
        if (planNoteCollectionIdentifiers.includes(planNoteIdentifier)) {
          return false;
        }
        planNoteCollectionIdentifiers.push(planNoteIdentifier);
        return true;
      });
      return [...planNotesToAdd, ...planNoteCollection];
    }
    return planNoteCollection;
  }

  protected convertDateFromClient<T extends PlanNote | NewPlanNote | PartialUpdatePlanNote>(planNote: T): RestOf<T> {
    return {
      ...planNote,
      createdDate: planNote.createdDate?.toJSON() ?? null,
      lastModfiedDate: planNote.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPlanNote: PlanNote | RestPlanNote): PlanNote {
    return {
      ...restPlanNote,
      createdDate: restPlanNote.createdDate ? dayjs(restPlanNote.createdDate) : undefined,
      lastModifiedDate: restPlanNote.lastModifiedDate ? dayjs(restPlanNote.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPlanNote>): HttpResponse<PlanNote> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPlanNote[]>): HttpResponse<PlanNote[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERM.2
   */
  findByPlanId(id: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<PlanNote[]>(`${this.resourceUrl}/plan/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((planNote: PlanNote) => {
        planNote.createdDate = planNote.createdDate ? dayjs(planNote.createdDate) : undefined;
        planNote.lastModifiedDate = planNote.lastModifiedDate ? dayjs(planNote.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
