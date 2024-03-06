import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Muscle, NewMuscle } from '../muscle.model';

export type PartialUpdateMuscle = Partial<Muscle> & Pick<Muscle, 'id'>;

export type EntityResponseType = HttpResponse<Muscle>;
export type EntityArrayResponseType = HttpResponse<Muscle[]>;

@Injectable({ providedIn: 'root' })
export class MuscleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/muscles');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(muscle: NewMuscle): Observable<EntityResponseType> {
    return this.http.post<Muscle>(this.resourceUrl, muscle, { observe: 'response' });
  }

  update(muscle: Muscle): Observable<EntityResponseType> {
    return this.http.put<Muscle>(`${this.resourceUrl}/${this.getMuscleIdentifier(muscle)}`, muscle, { observe: 'response' });
  }

  partialUpdate(muscle: PartialUpdateMuscle): Observable<EntityResponseType> {
    return this.http.patch<Muscle>(`${this.resourceUrl}/${this.getMuscleIdentifier(muscle)}`, muscle, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<Muscle>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Muscle[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMuscleIdentifier(muscle: Pick<Muscle, 'id'>): number {
    return muscle.id;
  }

  compareMuscle(o1: Pick<Muscle, 'id'> | null, o2: Pick<Muscle, 'id'> | null): boolean {
    return o1 && o2 ? this.getMuscleIdentifier(o1) === this.getMuscleIdentifier(o2) : o1 === o2;
  }

  addMuscleToCollectionIfMissing<Type extends Pick<Muscle, 'id'>>(
    muscleCollection: Type[],
    ...musclesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const muscles: Type[] = musclesToCheck.filter(isPresent);
    if (muscles.length > 0) {
      const muscleCollectionIdentifiers = muscleCollection.map(muscleItem => this.getMuscleIdentifier(muscleItem)!);
      const musclesToAdd = muscles.filter(muscleItem => {
        const muscleIdentifier = this.getMuscleIdentifier(muscleItem);
        if (muscleCollectionIdentifiers.includes(muscleIdentifier)) {
          return false;
        }
        muscleCollectionIdentifiers.push(muscleIdentifier);
        return true;
      });
      return [...musclesToAdd, ...muscleCollection];
    }
    return muscleCollection;
  }
}
