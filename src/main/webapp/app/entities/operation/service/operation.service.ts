import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Operation, NewOperation } from '../operation.model';

export type PartialUpdateOperation = Partial<Operation> & Pick<Operation, 'id'>;

type RestOf<T extends Operation | NewOperation> = Omit<T, 'operationDate' | 'createdDate' | 'lastModifiedDate'> & {
  operationDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestOperation = RestOf<Operation>;

export type NewRestOperation = RestOf<NewOperation>;

export type PartialUpdateRestOperation = RestOf<PartialUpdateOperation>;

export type EntityResponseType = HttpResponse<Operation>;
export type EntityArrayResponseType = HttpResponse<Operation[]>;

@Injectable({ providedIn: 'root' })
export class OperationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/operations');
  public resourceUrlClient = this.resourceUrl + '/client';

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(operation: NewOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operation);
    return this.http
      .post<RestOperation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(operation: Operation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operation);
    return this.http
      .put<RestOperation>(`${this.resourceUrl}/${this.getOperationIdentifier(operation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(operation: PartialUpdateOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operation);
    return this.http
      .patch<RestOperation>(`${this.resourceUrl}/${this.getOperationIdentifier(operation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestOperation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestOperation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOperationIdentifier(operation: Pick<Operation, 'id'>): number {
    return operation.id;
  }

  compareOperation(o1: Pick<Operation, 'id'> | null, o2: Pick<Operation, 'id'> | null): boolean {
    return o1 && o2 ? this.getOperationIdentifier(o1) === this.getOperationIdentifier(o2) : o1 === o2;
  }

  addOperationToCollectionIfMissing<Type extends Pick<Operation, 'id'>>(
    operationCollection: Type[],
    ...operationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const operations: Type[] = operationsToCheck.filter(isPresent);
    if (operations.length > 0) {
      const operationCollectionIdentifiers = operationCollection.map(operationItem => this.getOperationIdentifier(operationItem)!);
      const operationsToAdd = operations.filter(operationItem => {
        const operationIdentifier = this.getOperationIdentifier(operationItem);
        if (operationCollectionIdentifiers.includes(operationIdentifier)) {
          return false;
        }
        operationCollectionIdentifiers.push(operationIdentifier);
        return true;
      });
      return [...operationsToAdd, ...operationCollection];
    }
    return operationCollection;
  }

  protected convertDateFromClient<T extends Operation | NewOperation | PartialUpdateOperation>(operation: T): RestOf<T> {
    return {
      ...operation,
      operationDate: operation.operationDate?.toJSON() ?? null,
      createdDate: operation.createdDate?.toJSON() ?? null,
      lastModifiedDate: operation.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restOperation: RestOperation): Operation {
    return {
      ...restOperation,
      operationDate: restOperation.operationDate ? dayjs(restOperation.operationDate) : undefined,
      createdDate: restOperation.createdDate ? dayjs(restOperation.createdDate) : undefined,
      lastModifiedDate: restOperation.lastModifiedDate ? dayjs(restOperation.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestOperation>): HttpResponse<Operation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestOperation[]>): HttpResponse<Operation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
  findByClientId(id: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<Operation[]>(`${this.resourceUrlClient}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((operation: Operation) => {
        operation.operationDate = operation.operationDate ? dayjs(operation.operationDate) : undefined;
      });
    }
    return res;
  }
  createForClient(operation: Operation, id: number): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operation);
    return this.http
      .post<Operation>(`${this.resourceUrlClient}/${id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertDateFromTypeServer(res)));
  }
  protected convertDateFromTypeServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.operationDate = res.body.operationDate ? dayjs(res.body.operationDate) : undefined;
    }
    return res;
  }
}
