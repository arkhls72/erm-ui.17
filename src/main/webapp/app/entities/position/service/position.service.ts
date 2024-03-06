import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { NewPosition, Position } from '../position.model';

export type PartialUpdatePosition = Partial<Position> & Pick<Position, 'id'>;

export type EntityResponseType = HttpResponse<Position>;
export type EntityArrayResponseType = HttpResponse<Position[]>;

@Injectable({ providedIn: 'root' })
export class PositionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/positions');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(position: NewPosition): Observable<EntityResponseType> {
    return this.http.post<Position>(this.resourceUrl, position, { observe: 'response' });
  }

  update(position: Position): Observable<EntityResponseType> {
    return this.http.put<Position>(`${this.resourceUrl}`, position, { observe: 'response' });
  }

  partialUpdate(position: PartialUpdatePosition): Observable<EntityResponseType> {
    return this.http.patch<Position>(`${this.resourceUrl}/${this.getPositionIdentifier(position)}`, position, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<Position>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Position[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPositionIdentifier(position: Pick<Position, 'id'>): number {
    return <number>position.id;
  }

  comparePosition(o1: Pick<Position, 'id'> | null, o2: Pick<Position, 'id'> | null): boolean {
    return o1 && o2 ? this.getPositionIdentifier(o1) === this.getPositionIdentifier(o2) : o1 === o2;
  }

  addPositionToCollectionIfMissing<Type extends Pick<Position, 'id'>>(
    positionCollection: Type[],
    ...positionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const positions: Type[] = positionsToCheck.filter(isPresent);
    if (positions.length > 0) {
      const positionCollectionIdentifiers = positionCollection.map(positionItem => this.getPositionIdentifier(positionItem)!);
      const positionsToAdd = positions.filter(positionItem => {
        const positionIdentifier = this.getPositionIdentifier(positionItem);
        if (positionCollectionIdentifiers.includes(positionIdentifier)) {
          return false;
        }
        positionCollectionIdentifiers.push(positionIdentifier);
        return true;
      });
      return [...positionsToAdd, ...positionCollection];
    }
    return positionCollection;
  }
}
