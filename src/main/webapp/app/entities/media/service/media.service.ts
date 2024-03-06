import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Media, NewMedia } from '../media.model';

export type PartialUpdateMedia = Partial<Media> & Pick<Media, 'id'>;

export type EntityResponseType = HttpResponse<Media>;
export type EntityArrayResponseType = HttpResponse<Media[]>;

@Injectable({ providedIn: 'root' })
export class MediaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/media');
  public resourceUrlByIds = this.resourceUrl + '/ids';
  public resourceexerUrl = this.resourceUrl + 'api/media/exer';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(media: NewMedia): Observable<EntityResponseType> {
    return this.http.post<Media>(this.resourceUrl, media, { observe: 'response' });
  }

  update(media: Media): Observable<EntityResponseType> {
    return this.http.put<Media>(`${this.resourceUrl}/${this.getMediaIdentifier(media)}`, media, { observe: 'response' });
  }

  partialUpdate(media: PartialUpdateMedia): Observable<EntityResponseType> {
    return this.http.patch<Media>(`${this.resourceUrl}/${this.getMediaIdentifier(media)}`, media, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<Media>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Media[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMediaIdentifier(media: Pick<Media, 'id'>): number {
    return media.id;
  }

  compareMedia(o1: Pick<Media, 'id'> | null, o2: Pick<Media, 'id'> | null): boolean {
    return o1 && o2 ? this.getMediaIdentifier(o1) === this.getMediaIdentifier(o2) : o1 === o2;
  }

  addMediaToCollectionIfMissing<Type extends Pick<Media, 'id'>>(
    mediaCollection: Type[],
    ...mediaToCheck: (Type | null | undefined)[]
  ): Type[] {
    const media: Type[] = mediaToCheck.filter(isPresent);
    if (media.length > 0) {
      const mediaCollectionIdentifiers = mediaCollection.map(mediaItem => this.getMediaIdentifier(mediaItem)!);
      const mediaToAdd = media.filter(mediaItem => {
        const mediaIdentifier = this.getMediaIdentifier(mediaItem);
        if (mediaCollectionIdentifiers.includes(mediaIdentifier)) {
          return false;
        }
        mediaCollectionIdentifiers.push(mediaIdentifier);
        return true;
      });
      return [...mediaToAdd, ...mediaCollection];
    }
    return mediaCollection;
  }

  /**
   * ERM.2
   */

  findByIds(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Media[]>(this.resourceUrlByIds, { params: options, observe: 'response' });
  }

  updateForExercise(media: Media, id: number, number: number): Observable<EntityResponseType> {
    return this.http.put<Media>(`${this.resourceexerUrl}/${id}/${number}`, media, { observe: 'response' });
  }

  createForExercise(media: Media, id: number, number: number): Observable<EntityResponseType> {
    return this.http.post<Media>(`${this.resourceexerUrl}/${id}/${number}`, media, { observe: 'response' });
  }
  addSrcMedia(mediaId?: number, medias?: Media[]) {
    if (mediaId) {
      if (medias) {
        const findMedia = medias.find(p => p.id === mediaId);
        if (findMedia && findMedia.contentType) {
          return 'data:' + findMedia.contentType + ';base64,' + findMedia.value;
        }
      }
    }
    return null;
  }
}
