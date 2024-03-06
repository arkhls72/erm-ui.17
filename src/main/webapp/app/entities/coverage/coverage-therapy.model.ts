import { BaseEntity } from '../../shared/model/base-entity';
export class CoverageTherapy implements BaseEntity {
  constructor(
    public id?: number,
    public ehcId?: number,
    public wsibId?: number,
    public mvaId?: number,
    public coverageId?: number | null,
    public therapyName?: string,
    public therapyId?: number,
    public limit?: number | null,
    public note?: string | null,
  ) {}
}
