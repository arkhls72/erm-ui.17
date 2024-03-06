import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Province, NewProvince } from '../province.model';

export type PartialUpdateProvince = Partial<Province> & Pick<Province, 'id'>;

export type EntityResponseType = HttpResponse<Province>;
export type EntityArrayResponseType = HttpResponse<Province[]>;

@Injectable({ providedIn: 'root' })
export class ProvinceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/provinces');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(province: NewProvince): Observable<EntityResponseType> {
    return this.http.post<Province>(this.resourceUrl, province, { observe: 'response' });
  }

  update(province: Province): Observable<EntityResponseType> {
    return this.http.put<Province>(`${this.resourceUrl}/${this.getProvinceIdentifier(province)}`, province, { observe: 'response' });
  }

  partialUpdate(province: PartialUpdateProvince): Observable<EntityResponseType> {
    return this.http.patch<Province>(`${this.resourceUrl}/${this.getProvinceIdentifier(province)}`, province, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<Province>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Province[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProvinceIdentifier(province: Pick<Province, 'id'>): number {
    return province.id;
  }

  compareProvince(o1: Pick<Province, 'id'> | null, o2: Pick<Province, 'id'> | null): boolean {
    return o1 && o2 ? this.getProvinceIdentifier(o1) === this.getProvinceIdentifier(o2) : o1 === o2;
  }

  addProvinceToCollectionIfMissing<Type extends Pick<Province, 'id'>>(
    provinceCollection: Type[],
    ...provincesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const provinces: Type[] = provincesToCheck.filter(isPresent);
    if (provinces.length > 0) {
      const provinceCollectionIdentifiers = provinceCollection.map(provinceItem => this.getProvinceIdentifier(provinceItem)!);
      const provincesToAdd = provinces.filter(provinceItem => {
        const provinceIdentifier = this.getProvinceIdentifier(provinceItem);
        if (provinceCollectionIdentifiers.includes(provinceIdentifier)) {
          return false;
        }
        provinceCollectionIdentifiers.push(provinceIdentifier);
        return true;
      });
      return [...provincesToAdd, ...provinceCollection];
    }
    return provinceCollection;
  }
}
