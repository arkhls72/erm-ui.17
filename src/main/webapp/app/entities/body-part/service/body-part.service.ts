import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { BodyPart, NewBodyPart } from '../body-part.model';

export type PartialUpdateBodyPart = Partial<BodyPart> & Pick<BodyPart, 'id'>;

export type EntityResponseType = HttpResponse<BodyPart>;
export type EntityArrayResponseType = HttpResponse<BodyPart[]>;

@Injectable({ providedIn: 'root' })
export class BodyPartService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/body-parts');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(bodyPart: NewBodyPart): Observable<EntityResponseType> {
    return this.http.post<BodyPart>(this.resourceUrl, bodyPart, { observe: 'response' });
  }

  update(bodyPart: BodyPart): Observable<EntityResponseType> {
    return this.http.put<BodyPart>(`${this.resourceUrl}/${this.getBodyPartIdentifier(bodyPart)}`, bodyPart, { observe: 'response' });
  }

  partialUpdate(bodyPart: PartialUpdateBodyPart): Observable<EntityResponseType> {
    return this.http.patch<BodyPart>(`${this.resourceUrl}/${this.getBodyPartIdentifier(bodyPart)}`, bodyPart, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<BodyPart>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<BodyPart[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBodyPartIdentifier(bodyPart: Pick<BodyPart, 'id'>): number {
    return bodyPart.id;
  }

  compareBodyPart(o1: Pick<BodyPart, 'id'> | null, o2: Pick<BodyPart, 'id'> | null): boolean {
    return o1 && o2 ? this.getBodyPartIdentifier(o1) === this.getBodyPartIdentifier(o2) : o1 === o2;
  }

  addBodyPartToCollectionIfMissing<Type extends Pick<BodyPart, 'id'>>(
    bodyPartCollection: Type[],
    ...bodyPartsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bodyParts: Type[] = bodyPartsToCheck.filter(isPresent);
    if (bodyParts.length > 0) {
      const bodyPartCollectionIdentifiers = bodyPartCollection.map(bodyPartItem => this.getBodyPartIdentifier(bodyPartItem)!);
      const bodyPartsToAdd = bodyParts.filter(bodyPartItem => {
        const bodyPartIdentifier = this.getBodyPartIdentifier(bodyPartItem);
        if (bodyPartCollectionIdentifiers.includes(bodyPartIdentifier)) {
          return false;
        }
        bodyPartCollectionIdentifiers.push(bodyPartIdentifier);
        return true;
      });
      return [...bodyPartsToAdd, ...bodyPartCollection];
    }
    return bodyPartCollection;
  }
}
