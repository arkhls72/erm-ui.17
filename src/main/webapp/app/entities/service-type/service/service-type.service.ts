import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ServiceType, NewServiceType } from '../service-type.model';

export type PartialUpdateServiceType = Partial<ServiceType> & Pick<ServiceType, 'id'>;

export type EntityResponseType = HttpResponse<ServiceType>;
export type EntityArrayResponseType = HttpResponse<ServiceType[]>;

@Injectable({ providedIn: 'root' })
export class ServiceTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/service-types');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(serviceType: NewServiceType): Observable<EntityResponseType> {
    return this.http.post<ServiceType>(this.resourceUrl, serviceType, { observe: 'response' });
  }

  update(serviceType: ServiceType): Observable<EntityResponseType> {
    return this.http.put<ServiceType>(`${this.resourceUrl}/${this.getServiceTypeIdentifier(serviceType)}`, serviceType, {
      observe: 'response',
    });
  }

  partialUpdate(serviceType: PartialUpdateServiceType): Observable<EntityResponseType> {
    return this.http.patch<ServiceType>(`${this.resourceUrl}/${this.getServiceTypeIdentifier(serviceType)}`, serviceType, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ServiceType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ServiceType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getServiceTypeIdentifier(serviceType: Pick<ServiceType, 'id'>): number {
    return serviceType.id;
  }

  compareServiceType(o1: Pick<ServiceType, 'id'> | null, o2: Pick<ServiceType, 'id'> | null): boolean {
    return o1 && o2 ? this.getServiceTypeIdentifier(o1) === this.getServiceTypeIdentifier(o2) : o1 === o2;
  }

  addServiceTypeToCollectionIfMissing<Type extends Pick<ServiceType, 'id'>>(
    serviceTypeCollection: Type[],
    ...serviceTypesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const serviceTypes: Type[] = serviceTypesToCheck.filter(isPresent);
    if (serviceTypes.length > 0) {
      const serviceTypeCollectionIdentifiers = serviceTypeCollection.map(
        serviceTypeItem => this.getServiceTypeIdentifier(serviceTypeItem)!,
      );
      const serviceTypesToAdd = serviceTypes.filter(serviceTypeItem => {
        const serviceTypeIdentifier = this.getServiceTypeIdentifier(serviceTypeItem);
        if (serviceTypeCollectionIdentifiers.includes(serviceTypeIdentifier)) {
          return false;
        }
        serviceTypeCollectionIdentifiers.push(serviceTypeIdentifier);
        return true;
      });
      return [...serviceTypesToAdd, ...serviceTypeCollection];
    }
    return serviceTypeCollection;
  }
}
