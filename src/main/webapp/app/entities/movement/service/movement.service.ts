import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Movement, NewMovement } from '../movement.model';

export type PartialUpdateMovement = Partial<Movement> & Pick<Movement, 'id'>;

export type EntityResponseType = HttpResponse<Movement>;
export type EntityArrayResponseType = HttpResponse<Movement[]>;

@Injectable({ providedIn: 'root' })
export class MovementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/movements');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(movement: NewMovement): Observable<EntityResponseType> {
    return this.http.post<Movement>(this.resourceUrl, movement, { observe: 'response' });
  }

  update(movement: Movement): Observable<EntityResponseType> {
    return this.http.put<Movement>(`${this.resourceUrl}/${this.getMovementIdentifier(movement)}`, movement, { observe: 'response' });
  }

  partialUpdate(movement: PartialUpdateMovement): Observable<EntityResponseType> {
    return this.http.patch<Movement>(`${this.resourceUrl}/${this.getMovementIdentifier(movement)}`, movement, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<Movement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Movement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMovementIdentifier(movement: Pick<Movement, 'id'>): number {
    return movement.id;
  }

  compareMovement(o1: Pick<Movement, 'id'> | null, o2: Pick<Movement, 'id'> | null): boolean {
    return o1 && o2 ? this.getMovementIdentifier(o1) === this.getMovementIdentifier(o2) : o1 === o2;
  }

  addMovementToCollectionIfMissing<Type extends Pick<Movement, 'id'>>(
    movementCollection: Type[],
    ...movementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const movements: Type[] = movementsToCheck.filter(isPresent);
    if (movements.length > 0) {
      const movementCollectionIdentifiers = movementCollection.map(movementItem => this.getMovementIdentifier(movementItem)!);
      const movementsToAdd = movements.filter(movementItem => {
        const movementIdentifier = this.getMovementIdentifier(movementItem);
        if (movementCollectionIdentifiers.includes(movementIdentifier)) {
          return false;
        }
        movementCollectionIdentifiers.push(movementIdentifier);
        return true;
      });
      return [...movementsToAdd, ...movementCollection];
    }
    return movementCollection;
  }
}
