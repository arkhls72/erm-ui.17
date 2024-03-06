import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Countries, NewCountries } from '../countries.model';

export type PartialUpdateCountries = Partial<Countries> & Pick<Countries, 'id'>;

export type EntityResponseType = HttpResponse<Countries>;
export type EntityArrayResponseType = HttpResponse<Countries[]>;

@Injectable({ providedIn: 'root' })
export class CountriesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/countries');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(countries: NewCountries): Observable<EntityResponseType> {
    return this.http.post<Countries>(this.resourceUrl, countries, { observe: 'response' });
  }

  update(countries: Countries): Observable<EntityResponseType> {
    return this.http.put<Countries>(`${this.resourceUrl}/${this.getCountriesIdentifier(countries)}`, countries, { observe: 'response' });
  }

  partialUpdate(countries: PartialUpdateCountries): Observable<EntityResponseType> {
    return this.http.patch<Countries>(`${this.resourceUrl}/${this.getCountriesIdentifier(countries)}`, countries, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<Countries>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Countries[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCountriesIdentifier(countries: Pick<Countries, 'id'>): number {
    return countries.id;
  }

  compareCountries(o1: Pick<Countries, 'id'> | null, o2: Pick<Countries, 'id'> | null): boolean {
    return o1 && o2 ? this.getCountriesIdentifier(o1) === this.getCountriesIdentifier(o2) : o1 === o2;
  }

  addCountriesToCollectionIfMissing<Type extends Pick<Countries, 'id'>>(
    countriesCollection: Type[],
    ...countriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const countries: Type[] = countriesToCheck.filter(isPresent);
    if (countries.length > 0) {
      const countriesCollectionIdentifiers = countriesCollection.map(countriesItem => this.getCountriesIdentifier(countriesItem)!);
      const countriesToAdd = countries.filter(countriesItem => {
        const countriesIdentifier = this.getCountriesIdentifier(countriesItem);
        if (countriesCollectionIdentifiers.includes(countriesIdentifier)) {
          return false;
        }
        countriesCollectionIdentifiers.push(countriesIdentifier);
        return true;
      });
      return [...countriesToAdd, ...countriesCollection];
    }
    return countriesCollection;
  }
}
