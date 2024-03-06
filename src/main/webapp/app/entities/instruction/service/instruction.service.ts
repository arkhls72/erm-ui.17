import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Instruction } from '../instruction.model';
import { DATE_FORMAT } from '../../../config/input.constants';
import { ExerGroupWrapper } from '../../exer-group/exer-group-wrapper.model';

export type PartialUpdateInstruction = Partial<Instruction> & Pick<Instruction, 'id'>;

type RestOf<T extends Instruction> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestInstruction = RestOf<Instruction>;

// export type NewRestInstruction = RestOf<Instruction>;
//
// export type PartialUpdateRestInstruction = RestOf<PartialUpdateInstruction>;

export type EntityResponseType = HttpResponse<Instruction>;
export type EntityArrayResponseType = HttpResponse<Instruction[]>;
type EntityResponseGroupWrapperType = HttpResponse<ExerGroupWrapper>;

@Injectable({ providedIn: 'root' })
export class InstructionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/instructions');
  public resourceUrlDefault = this.resourceUrl + '/default';
  public resourceGroupUrl = this.resourceUrl + '/group';
  public resourceProgUrl = this.resourceUrl + '/prog';

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(instruction: Instruction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(instruction);
    return this.http
      .post<RestInstruction>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(instruction: Instruction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(instruction);
    return this.http
      .put<RestInstruction>(`${this.resourceUrl}/${this.getInstructionIdentifier(instruction)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(instruction: PartialUpdateInstruction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(instruction);
    return this.http
      .patch<RestInstruction>(`${this.resourceUrl}/${this.getInstructionIdentifier(instruction)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInstruction>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInstruction[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInstructionIdentifier(instruction: Pick<Instruction, 'id'>): number {
    return <number>instruction.id;
  }

  compareInstruction(o1: Pick<Instruction, 'id'> | null, o2: Pick<Instruction, 'id'> | null): boolean {
    return o1 && o2 ? this.getInstructionIdentifier(o1) === this.getInstructionIdentifier(o2) : o1 === o2;
  }

  addInstructionToCollectionIfMissing<Type extends Pick<Instruction, 'id'>>(
    instructionCollection: Type[],
    ...instructionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const instructions: Type[] = instructionsToCheck.filter(isPresent);
    if (instructions.length > 0) {
      const instructionCollectionIdentifiers = instructionCollection.map(
        instructionItem => this.getInstructionIdentifier(instructionItem)!,
      );
      const instructionsToAdd = instructions.filter(instructionItem => {
        const instructionIdentifier = this.getInstructionIdentifier(instructionItem);
        if (instructionCollectionIdentifiers.includes(instructionIdentifier)) {
          return false;
        }
        instructionCollectionIdentifiers.push(instructionIdentifier);
        return true;
      });
      return [...instructionsToAdd, ...instructionCollection];
    }
    return instructionCollection;
  }

  // protected convertDateFromClient<T extends Instruction | NewInstruction | PartialUpdateInstruction>(instruction: T): RestOf<T> {
  //   // return {
  //     // ...instruction,
  //     // createdDate: instruction.createdDate?.toJSON() ?? null,
  //     // lastModifiedDate: instruction.lastModifiedDate?.toJSON() ?? null,
  //   // };
  //   return {
  //     ...instruction,
  //     createdDate: instruction.createdDate ? dayjs(instruction.createdDate) : undefined,
  //     lastModifiedDate: restInstruction.lastModifiedDate ? dayjs(instruction.lastModifiedDate) : undefined,
  //   };
  //
  // }

  protected convertDateFromClientWrapper(input: ExerGroupWrapper): ExerGroupWrapper {
    const copy = {} as ExerGroupWrapper;
    const instruction = input.instruction;
    if (instruction && instruction.lastModifiedDate) {
      instruction.lastModifiedDate = instruction?.lastModifiedDate ? dayjs(instruction.lastModifiedDate) : null;
      instruction.createdDate = instruction?.createdDate ? dayjs(instruction.createdDate) : null;
    }
    copy.instruction = instruction;
    return copy;
  }

  protected convertDateFromClient(instruction: Instruction): Instruction {
    const copy: Instruction = Object.assign({}, instruction, {
      lastModifiedDate:
        instruction.lastModifiedDate && instruction.lastModifiedDate.isValid()
          ? instruction.lastModifiedDate.format(DATE_FORMAT)
          : undefined,
      createdDate: instruction.createdDate ? dayjs(instruction.createdDate) : undefined,
    });
    return copy;
  }
  protected convertDateFromServer(restInstruction: RestInstruction): Instruction {
    return {
      ...restInstruction,
      createdDate: restInstruction.createdDate ? dayjs(restInstruction.createdDate) : undefined,
      lastModifiedDate: restInstruction.lastModifiedDate ? dayjs(restInstruction.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestInstruction>): HttpResponse<Instruction> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseFromServerWrapper(res: HttpResponse<ExerGroupWrapper>): HttpResponse<ExerGroupWrapper> {
    if (res.body) {
      const instruction = res.body.instruction;
      if (instruction) {
        instruction.lastModifiedDate = instruction.lastModifiedDate ? dayjs(instruction.lastModifiedDate) : null;
        instruction.createdDate = instruction.createdDate ? dayjs(instruction.createdDate) : null;
      }

      const exercise = res.body.exercise;
      if (exercise) {
        exercise.lastModifiedDate = exercise.lastModifiedDate ? dayjs(exercise.lastModifiedDate) : null;
        exercise.createdDate = exercise.createdDate ? dayjs(exercise.createdDate) : null;
      }
      res.body.instruction = instruction;
      res.body.exercise = exercise;
    }
    return res;
  }
  protected convertResponseArrayFromServer(res: HttpResponse<RestInstruction[]>): HttpResponse<Instruction[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /*********************************
   * ERM2
   **********************************/

  findByExerciseId(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInstruction>(`${this.resourceUrl}/exercise/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  createDefault(instruction: Instruction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(instruction);
    return this.http
      .post<RestInstruction>(this.resourceUrlDefault, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  updateDefault(instruction: Instruction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(instruction);
    return this.http
      .put<RestInstruction>(this.resourceUrlDefault, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**************************************
   * ERM.2
   **************************************/

  // Find by groupId and exerciseId for listing in instruction page
  findByGroupExerciseIdPageable(req?: any, id?: number, groupId?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Instruction[]>(`${this.resourceGroupUrl}/${groupId}/exercise/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  createByGroup(exerGroupWrapper: ExerGroupWrapper): Observable<EntityResponseGroupWrapperType> {
    const copy = this.convertDateFromClientWrapper(exerGroupWrapper);
    return (
      this.http
        .post<ExerGroupWrapper>(`${this.resourceUrl}/group`, copy, { observe: 'response' })
        // .pipe(map((res: EntityResponseGroupWrapperType) => this.convertDateFromServer(res)));
        .pipe(map(res => this.convertResponseFromServerWrapper(res)))
    );
  }

  // Find by progId and exerciseId for listing in instruction page of client-program
  findByProgIdExerciseIdPageable(req?: any, progId?: number, id?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Instruction[]>(`${this.resourceProgUrl}/${progId}/exercise/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((instruction: Instruction) => {
        instruction.lastModifiedDate = instruction.lastModifiedDate ? dayjs(instruction.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
