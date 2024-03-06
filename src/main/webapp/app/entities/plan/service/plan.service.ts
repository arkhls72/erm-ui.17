import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Plan, NewPlan } from '../plan.model';

export type PartialUpdatePlan = Partial<Plan> & Pick<Plan, 'id'>;

type RestOf<T extends Plan | NewPlan> = Omit<T, 'startDate' | 'endDate' | 'createdDate' | 'lastModifiedDate'> & {
  startDate?: string | null;
  endDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestPlan = RestOf<Plan>;

export type NewRestPlan = RestOf<NewPlan>;

export type PartialUpdateRestPlan = RestOf<PartialUpdatePlan>;

export type EntityResponseType = HttpResponse<Plan>;
export type EntityArrayResponseType = HttpResponse<Plan[]>;

@Injectable({ providedIn: 'root' })
export class PlanService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/plans');
  public resourceUrlSearch = SERVER_API_URL + 'api/plans/_search';
  public resourceUrlClient = this.resourceUrl + '/client';

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(plan: Plan): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(plan);
    return this.http.post<RestPlan>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(plan: Plan): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(plan);
    return this.http
      .put<RestPlan>(`${this.resourceUrl}/${this.getPlanIdentifier(plan)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(plan: PartialUpdatePlan): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(plan);
    return this.http
      .patch<RestPlan>(`${this.resourceUrl}/${this.getPlanIdentifier(plan)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPlan>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPlan[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPlanIdentifier(plan: Pick<Plan, 'id'>): number {
    return plan.id;
  }

  comparePlan(o1: Pick<Plan, 'id'> | null, o2: Pick<Plan, 'id'> | null): boolean {
    return o1 && o2 ? this.getPlanIdentifier(o1) === this.getPlanIdentifier(o2) : o1 === o2;
  }

  addPlanToCollectionIfMissing<Type extends Pick<Plan, 'id'>>(
    planCollection: Type[],
    ...plansToCheck: (Type | null | undefined)[]
  ): Type[] {
    const plans: Type[] = plansToCheck.filter(isPresent);
    if (plans.length > 0) {
      const planCollectionIdentifiers = planCollection.map(planItem => this.getPlanIdentifier(planItem)!);
      const plansToAdd = plans.filter(planItem => {
        const planIdentifier = this.getPlanIdentifier(planItem);
        if (planCollectionIdentifiers.includes(planIdentifier)) {
          return false;
        }
        planCollectionIdentifiers.push(planIdentifier);
        return true;
      });
      return [...plansToAdd, ...planCollection];
    }
    return planCollection;
  }

  protected convertDateFromClient<T extends Plan | NewPlan | PartialUpdatePlan>(plan: T): RestOf<T> {
    return {
      ...plan,
      startDate: plan.startDate?.toJSON() ?? null,
      endDate: plan.endDate?.toJSON() ?? null,
      createdDate: plan.createdDate?.toJSON() ?? null,
      lastModifiedDate: plan.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPlan: RestPlan): Plan {
    return {
      ...restPlan,
      startDate: restPlan.startDate ? dayjs(restPlan.startDate) : undefined,
      endDate: restPlan.endDate ? dayjs(restPlan.endDate) : undefined,
      createdDate: restPlan.createdDate ? dayjs(restPlan.createdDate) : undefined,
      lastModifiedDate: restPlan.lastModifiedDate ? dayjs(restPlan.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPlan>): HttpResponse<Plan> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPlan[]>): HttpResponse<Plan[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  /**
   * ERM2
   */
  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Plan[]>(this.resourceUrlSearch, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((plan: Plan) => {
        plan.endDate = plan.endDate ? dayjs(plan.endDate) : undefined;
        plan.startDate = plan.startDate ? dayjs(plan.startDate) : undefined;
        plan.lastModifiedDate = plan.lastModifiedDate ? dayjs(plan.lastModifiedDate) : undefined;
      });
    }
    return res;
  }

  findByClientId(req?: any, id?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Plan[]>(`${this.resourceUrlClient}/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
}
