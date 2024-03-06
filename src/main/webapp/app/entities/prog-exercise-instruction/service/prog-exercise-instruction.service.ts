import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ProgExerciseInstruction, NewProgExerciseInstruction } from '../prog-exercise-instruction.model';
import { ProgExerciseWrapper } from '../../exer-group/exer-prog-wrapper.model';

export type PartialUpdateProgExerciseInstruction = Partial<ProgExerciseInstruction> & Pick<ProgExerciseInstruction, 'id'>;

type RestOf<T extends ProgExerciseInstruction | NewProgExerciseInstruction> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestProgExerciseInstruction = RestOf<ProgExerciseInstruction>;

export type NewRestProgExerciseInstruction = RestOf<NewProgExerciseInstruction>;

export type PartialUpdateRestProgExerciseInstruction = RestOf<PartialUpdateProgExerciseInstruction>;

export type EntityResponseType = HttpResponse<ProgExerciseInstruction>;
export type EntityArrayResponseType = HttpResponse<ProgExerciseInstruction[]>;
type EntityResponseWrapperType = HttpResponse<ProgExerciseWrapper>;

@Injectable({ providedIn: 'root' })
export class ProgExerciseInstructionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/prog-exercise-instructions');
  public resourceUrlWrapper = this.resourceUrl + '/wrapper';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(progExerciseInstruction: NewProgExerciseInstruction | ProgExerciseInstruction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(progExerciseInstruction);
    return this.http
      .post<RestProgExerciseInstruction>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(progExerciseInstruction: ProgExerciseInstruction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(progExerciseInstruction);
    return this.http
      .put<RestProgExerciseInstruction>(`${this.resourceUrl}/${this.getProgExerciseInstructionIdentifier(progExerciseInstruction)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(progExerciseInstruction: PartialUpdateProgExerciseInstruction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(progExerciseInstruction);
    return this.http
      .patch<RestProgExerciseInstruction>(
        `${this.resourceUrl}/${this.getProgExerciseInstructionIdentifier(progExerciseInstruction)}`,
        copy,
        { observe: 'response' },
      )
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProgExerciseInstruction>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProgExerciseInstruction[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProgExerciseInstructionIdentifier(progExerciseInstruction: Pick<ProgExerciseInstruction, 'id'>): number {
    return progExerciseInstruction.id;
  }

  compareProgExerciseInstruction(o1: Pick<ProgExerciseInstruction, 'id'> | null, o2: Pick<ProgExerciseInstruction, 'id'> | null): boolean {
    return o1 && o2 ? this.getProgExerciseInstructionIdentifier(o1) === this.getProgExerciseInstructionIdentifier(o2) : o1 === o2;
  }

  addProgExerciseInstructionToCollectionIfMissing<Type extends Pick<ProgExerciseInstruction, 'id'>>(
    progExerciseInstructionCollection: Type[],
    ...progExerciseInstructionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const progExerciseInstructions: Type[] = progExerciseInstructionsToCheck.filter(isPresent);
    if (progExerciseInstructions.length > 0) {
      const progExerciseInstructionCollectionIdentifiers = progExerciseInstructionCollection.map(
        progExerciseInstructionItem => this.getProgExerciseInstructionIdentifier(progExerciseInstructionItem)!,
      );
      const progExerciseInstructionsToAdd = progExerciseInstructions.filter(progExerciseInstructionItem => {
        const progExerciseInstructionIdentifier = this.getProgExerciseInstructionIdentifier(progExerciseInstructionItem);
        if (progExerciseInstructionCollectionIdentifiers.includes(progExerciseInstructionIdentifier)) {
          return false;
        }
        progExerciseInstructionCollectionIdentifiers.push(progExerciseInstructionIdentifier);
        return true;
      });
      return [...progExerciseInstructionsToAdd, ...progExerciseInstructionCollection];
    }
    return progExerciseInstructionCollection;
  }

  protected convertDateFromClient<T extends ProgExerciseInstruction | NewProgExerciseInstruction | PartialUpdateProgExerciseInstruction>(
    progExerciseInstruction: T,
  ): RestOf<T> {
    return {
      ...progExerciseInstruction,
      createdDate: progExerciseInstruction.createdDate?.toJSON() ?? null,
      lastModifiedDate: progExerciseInstruction.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(
    restProgExerciseInstruction: RestProgExerciseInstruction | ProgExerciseInstruction,
  ): ProgExerciseInstruction {
    return {
      ...restProgExerciseInstruction,
      createdDate: restProgExerciseInstruction.createdDate ? dayjs(restProgExerciseInstruction.createdDate) : undefined,
      lastModifiedDate: restProgExerciseInstruction.lastModifiedDate ? dayjs(restProgExerciseInstruction.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(
    res: HttpResponse<RestProgExerciseInstruction> | HttpResponse<ProgExerciseInstruction>,
  ): HttpResponse<ProgExerciseInstruction> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProgExerciseInstruction[]>): HttpResponse<ProgExerciseInstruction[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERm2
   */
  findByProgExercise(progId?: number, exerciseId?: number): Observable<EntityResponseType> {
    return this.http
      .get<ProgExerciseInstruction>(`${this.resourceUrl}/prog${progId}/exercise/{exerciseId}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }
  findWrapperByProg(id?: number): Observable<EntityResponseWrapperType> {
    return this.http
      .get<ProgExerciseWrapper>(`${this.resourceUrl}/prog/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseWrapperType) => this.convertDateWrapperFromServer(res)));
  }

  createWithWrapper(progExerciseWrapper: ProgExerciseWrapper): Observable<EntityResponseWrapperType> {
    const copy = progExerciseWrapper;
    return this.http
      .post<ProgExerciseWrapper>(this.resourceUrlWrapper, copy, { observe: 'response' })
      .pipe(map(res => this.convertDateWrapperFromServer(res)));
  }

  // protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
  //   if (res.body) {
  //     res.body.createdDate = res.body.createdDate ? dayjs(res.body.createdDate) : undefined;
  //     res.body.lastModifiedDate = res.body.lastModifiedDate ? dayjs(res.body.lastModifiedDate) : undefined;
  //   }
  //
  //   return res;
  // }
  protected convertDateWrapperFromServer(res: EntityResponseWrapperType): EntityResponseWrapperType {
    if (res.body) {
      if (res.body!.progExerciseInstructions) {
        res.body.progExerciseInstructions.forEach(item => {
          item.createdDate = item.createdDate ? dayjs(item.createdDate) : undefined;
          item.lastModifiedDate = item.lastModifiedDate ? dayjs(item.lastModifiedDate) : undefined;
        });
      }
      if (res.body.instructions) {
        res.body.instructions.forEach(item => {
          item.lastModifiedDate = item.lastModifiedDate ? dayjs(item.lastModifiedDate) : undefined;
        });
      }
    }
    return res;
  }
}
