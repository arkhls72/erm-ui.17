import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Therapy, NewTherapy } from '../therapy.model';

export type PartialUpdateTherapy = Partial<Therapy> & Pick<Therapy, 'id'>;

export type EntityResponseType = HttpResponse<Therapy>;
export type EntityArrayResponseType = HttpResponse<Therapy[]>;

@Injectable({ providedIn: 'root' })
export class TherapyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/therapies');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(therapy: NewTherapy): Observable<EntityResponseType> {
    return this.http.post<Therapy>(this.resourceUrl, therapy, { observe: 'response' });
  }

  update(therapy: Therapy): Observable<EntityResponseType> {
    return this.http.put<Therapy>(`${this.resourceUrl}/${this.getTherapyIdentifier(therapy)}`, therapy, { observe: 'response' });
  }

  partialUpdate(therapy: PartialUpdateTherapy): Observable<EntityResponseType> {
    return this.http.patch<Therapy>(`${this.resourceUrl}/${this.getTherapyIdentifier(therapy)}`, therapy, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<Therapy>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Therapy[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTherapyIdentifier(therapy: Pick<Therapy, 'id'>): number {
    return <number>therapy.id;
  }

  compareTherapy(o1: Pick<Therapy, 'id'> | null, o2: Pick<Therapy, 'id'> | null): boolean {
    return o1 && o2 ? this.getTherapyIdentifier(o1) === this.getTherapyIdentifier(o2) : o1 === o2;
  }

  addTherapyToCollectionIfMissing<Type extends Pick<Therapy, 'id'>>(
    therapyCollection: Type[],
    ...therapiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const therapies: Type[] = therapiesToCheck.filter(isPresent);
    if (therapies.length > 0) {
      const therapyCollectionIdentifiers = therapyCollection.map(therapyItem => this.getTherapyIdentifier(therapyItem)!);
      const therapiesToAdd = therapies.filter(therapyItem => {
        const therapyIdentifier = this.getTherapyIdentifier(therapyItem);
        if (therapyCollectionIdentifiers.includes(therapyIdentifier)) {
          return false;
        }
        therapyCollectionIdentifiers.push(therapyIdentifier);
        return true;
      });
      return [...therapiesToAdd, ...therapyCollection];
    }
    return therapyCollection;
  }

  /**
   * ERM.2
   */

  queryAll(): Observable<EntityArrayResponseType> {
    return this.http.get<Therapy[]>(this.resourceUrl, { observe: 'response' });
  }
}
