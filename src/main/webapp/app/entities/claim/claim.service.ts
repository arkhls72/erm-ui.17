import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Claim } from 'app/entities/claim/claim.model';
import { ApplicationConfigService } from '../../core/config/application-config.service';
import { createRequestOption } from '../../core/request/request-util';

type EntityResponseType = HttpResponse<Claim>;
type EntityArrayResponseType = HttpResponse<Claim[]>;

@Injectable({ providedIn: 'root' })
export class ClaimService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/claims');
  public resourceUrlClient = this.resourceUrl + '/client';

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(claim: Claim): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(claim);
    return this.http
      .post<Claim>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(claim: Claim): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(claim);
    return this.http
      .put<Claim>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<Claim>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findActiveByClientId(id: number): Observable<EntityResponseType> {
    return this.http
      .get<Claim>(`${this.resourceUrlClient}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Claim[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(claim: Claim): Claim {
    const copy: Claim = claim;
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    return res;
  }
}
