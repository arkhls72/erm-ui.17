import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class Coverage implements BaseEntity {
  constructor(
    public id: number | null,
    public therapyId?: number | null,
    public ehcId?: number | null,
    public wsibId?: number | null,
    public mvaId?: number | null,
    public limit?: number | null,
    public note?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
  ) {}
}

export type NewCoverage = Omit<Coverage, 'id'> & { id: null };
