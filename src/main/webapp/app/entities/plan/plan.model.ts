import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';
import { Assessment } from '../assessment/assessment.model';
import { PlanNote } from '../plan-note/plan-note.model';

export class Plan implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
    public status?: string | null,
    public clientId?: number | null,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public assessmentId?: number | null,
    public assessment?: Assessment | null,
    public programs?: number | null,
    public clinicalNote?: PlanNote | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
  ) {}
}

export type NewPlan = Omit<Plan, 'id'> & { id: null };
