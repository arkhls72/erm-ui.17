import { BaseEntity } from '../../shared/model/base-entity';

export class CommonServiceCode implements BaseEntity {
  constructor(
    public id: number,
    public serviceCode?: string | null,
    public description?: string | null,
    public serviceType?: number | null,
    public category?: string | null,
    public note?: string | null,
  ) {}
}

export type NewCommonServiceCode = Omit<CommonServiceCode, 'id'> & { id: null };
