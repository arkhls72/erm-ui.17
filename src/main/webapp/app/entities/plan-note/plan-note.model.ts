import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class PlanNote implements BaseEntity {
  constructor(
    public id: number,
    public planId?: number | null,
    public note?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewPlanNote = Omit<PlanNote, 'id'> & { id: null };
