import { BaseEntity } from '../../shared/model/base-entity';

export class EhcSecondary implements BaseEntity {
  constructor(
    public id?: number,
    public clientId?: number,
    public ehcIds?: number[],
    public ehcType?: string,
    public status?: string,
  ) {}
}
