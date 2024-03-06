import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ProgGroupInstruction, NewProgGroupInstruction } from '../prog-group-instruction.model';

export type PartialUpdateProgGroupInstruction = Partial<ProgGroupInstruction> & Pick<ProgGroupInstruction, 'id'>;

type RestOf<T extends ProgGroupInstruction | NewProgGroupInstruction> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestProgGroupInstruction = RestOf<ProgGroupInstruction>;

export type NewRestProgGroupInstruction = RestOf<NewProgGroupInstruction>;

export type PartialUpdateRestProgGroupInstruction = RestOf<PartialUpdateProgGroupInstruction>;

export type EntityResponseType = HttpResponse<ProgGroupInstruction>;
export type EntityArrayResponseType = HttpResponse<ProgGroupInstruction[]>;

@Injectable({ providedIn: 'root' })
export class ProgGroupInstructionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/prog-group-instructions');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(progGroupInstruction: NewProgGroupInstruction | ProgGroupInstruction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(progGroupInstruction);
    return this.http
      .post<RestProgGroupInstruction>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(progGroupInstruction: ProgGroupInstruction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(progGroupInstruction);
    return this.http
      .put<RestProgGroupInstruction>(`${this.resourceUrl}/${this.getProgGroupInstructionIdentifier(progGroupInstruction)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(progGroupInstruction: PartialUpdateProgGroupInstruction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(progGroupInstruction);
    return this.http
      .patch<RestProgGroupInstruction>(`${this.resourceUrl}/${this.getProgGroupInstructionIdentifier(progGroupInstruction)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProgGroupInstruction>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProgGroupInstruction[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProgGroupInstructionIdentifier(progGroupInstruction: Pick<ProgGroupInstruction, 'id'>): number {
    return progGroupInstruction.id;
  }

  compareProgGroupInstruction(o1: Pick<ProgGroupInstruction, 'id'> | null, o2: Pick<ProgGroupInstruction, 'id'> | null): boolean {
    return o1 && o2 ? this.getProgGroupInstructionIdentifier(o1) === this.getProgGroupInstructionIdentifier(o2) : o1 === o2;
  }

  addProgGroupInstructionToCollectionIfMissing<Type extends Pick<ProgGroupInstruction, 'id'>>(
    progGroupInstructionCollection: Type[],
    ...progGroupInstructionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const progGroupInstructions: Type[] = progGroupInstructionsToCheck.filter(isPresent);
    if (progGroupInstructions.length > 0) {
      const progGroupInstructionCollectionIdentifiers = progGroupInstructionCollection.map(
        progGroupInstructionItem => this.getProgGroupInstructionIdentifier(progGroupInstructionItem)!,
      );
      const progGroupInstructionsToAdd = progGroupInstructions.filter(progGroupInstructionItem => {
        const progGroupInstructionIdentifier = this.getProgGroupInstructionIdentifier(progGroupInstructionItem);
        if (progGroupInstructionCollectionIdentifiers.includes(progGroupInstructionIdentifier)) {
          return false;
        }
        progGroupInstructionCollectionIdentifiers.push(progGroupInstructionIdentifier);
        return true;
      });
      return [...progGroupInstructionsToAdd, ...progGroupInstructionCollection];
    }
    return progGroupInstructionCollection;
  }

  protected convertDateFromClient<T extends ProgGroupInstruction | NewProgGroupInstruction | PartialUpdateProgGroupInstruction>(
    progGroupInstruction: T,
  ): RestOf<T> {
    return {
      ...progGroupInstruction,
      createdDate: progGroupInstruction.createdDate?.toJSON() ?? null,
      lastModifiedDate: progGroupInstruction.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restProgGroupInstruction: RestProgGroupInstruction | ProgGroupInstruction): ProgGroupInstruction {
    return {
      ...restProgGroupInstruction,
      createdDate: restProgGroupInstruction.createdDate ? dayjs(restProgGroupInstruction.createdDate) : undefined,
      lastModifiedDate: restProgGroupInstruction.lastModifiedDate ? dayjs(restProgGroupInstruction.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(
    res: HttpResponse<RestProgGroupInstruction> | HttpResponse<ProgGroupInstruction>,
  ): HttpResponse<ProgGroupInstruction> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProgGroupInstruction[]>): HttpResponse<ProgGroupInstruction[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERM.2
   */

  findByProgExercise(id?: number, exerciseId?: number): Observable<EntityResponseType> {
    return this.http
      .get<ProgGroupInstruction>(`${this.resourceUrl}/prog/${id}/exercise/${exerciseId}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }
}
