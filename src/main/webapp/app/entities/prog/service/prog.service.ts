import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Prog, NewProg } from '../prog.model';

export type PartialUpdateProg = Partial<Prog> & Pick<Prog, 'id'>;

type RestOf<T extends Prog | NewProg> = Omit<T, 'startDate' | 'endDate' | 'createdDate' | 'createdBy' | 'lastModifiedDate'> & {
  startDate?: string | null;
  endDate?: string | null;
  createdDate?: string | null;
  createdBy?: string | null;
  lastModifiedDate?: string | null;
};

export type RestProg = RestOf<Prog>;

export type NewRestProg = RestOf<NewProg>;

export type PartialUpdateRestProg = RestOf<PartialUpdateProg>;

export type EntityResponseType = HttpResponse<Prog>;
export type EntityArrayResponseType = HttpResponse<Prog[]>;

@Injectable({ providedIn: 'root' })
export class ProgService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/progs');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(prog: NewProg | Prog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(prog);
    return this.http.post<RestProg>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(prog: Prog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(prog);
    return this.http
      .put<RestProg>(`${this.resourceUrl}/${this.getProgIdentifier(prog)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(prog: PartialUpdateProg): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(prog);
    return this.http
      .patch<RestProg>(`${this.resourceUrl}/${this.getProgIdentifier(prog)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProg>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProg[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProgIdentifier(prog: Pick<Prog, 'id'>): number {
    return prog.id;
  }

  compareProg(o1: Pick<Prog, 'id'> | null, o2: Pick<Prog, 'id'> | null): boolean {
    return o1 && o2 ? this.getProgIdentifier(o1) === this.getProgIdentifier(o2) : o1 === o2;
  }

  addProgToCollectionIfMissing<Type extends Pick<Prog, 'id'>>(
    progCollection: Type[],
    ...progsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const progs: Type[] = progsToCheck.filter(isPresent);
    if (progs.length > 0) {
      const progCollectionIdentifiers = progCollection.map(progItem => this.getProgIdentifier(progItem)!);
      const progsToAdd = progs.filter(progItem => {
        const progIdentifier = this.getProgIdentifier(progItem);
        if (progCollectionIdentifiers.includes(progIdentifier)) {
          return false;
        }
        progCollectionIdentifiers.push(progIdentifier);
        return true;
      });
      return [...progsToAdd, ...progCollection];
    }
    return progCollection;
  }

  protected convertDateFromClient<T extends Prog | NewProg | PartialUpdateProg>(prog: T): RestOf<T> {
    return {
      ...prog,
      startDate: prog.startDate?.toJSON() ?? null,
      endDate: prog.endDate?.toJSON() ?? null,
      createdDate: prog.createdDate?.toJSON() ?? null,
      createdBy: prog.createdBy?.toJSON() ?? null,
      lastModifiedDate: prog.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restProg: RestProg): Prog {
    return {
      ...restProg,
      startDate: restProg.startDate ? dayjs(restProg.startDate) : undefined,
      endDate: restProg.endDate ? dayjs(restProg.endDate) : undefined,
      createdDate: restProg.createdDate ? dayjs(restProg.createdDate) : undefined,
      createdBy: restProg.createdBy ? dayjs(restProg.createdBy) : undefined,
      lastModifiedDate: restProg.lastModifiedDate ? dayjs(restProg.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProg>): HttpResponse<Prog> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProg[]>): HttpResponse<Prog[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
  searchByClient(req?: any, id?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Prog[]>(`${this.resourceUrl}/search/client/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  findByClient(req?: any, id?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Prog[]>(`${this.resourceUrl}/client/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((prog: Prog) => {
        prog.lastModifiedDate = prog.lastModifiedDate ? dayjs(prog.lastModifiedDate) : undefined;
        prog.startDate = prog.startDate ? dayjs(prog.startDate) : undefined;
        prog.endDate = prog.endDate ? dayjs(prog.endDate) : undefined;
      });
    }
    return res;
  }
}
