import { BaseEntity } from '../../shared/model/base-entity';

export class Media implements BaseEntity {
  constructor(
    public id: number | number,
    public contentType?: string | null,
    public valueContentType?: string | null,
    public value?: any,
    public name?: string | null,
  ) {}
}

export type NewMedia = Omit<Media, 'id'> & { id: null };
