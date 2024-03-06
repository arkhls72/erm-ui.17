import { BaseEntity } from '../../shared/model/base-entity';

export class Insurance implements BaseEntity {
  constructor(
    public id: number,
    public clientId?: number | null,
    public ehcId?: number | null,
    public coveragerId?: number | null,
    public mvaId?: number | null,
    public wsibId?: number | null,
  ) {}
}

export type NewInsurance = Omit<Insurance, 'id'> & { id: null };
