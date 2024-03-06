import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';
import { ProgNote } from '../prog-note/prog-note.model';
import { Assessment } from '../assessment/assessment.model';

export class Prog implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
    public status?: string | null,
    public clientId?: number | null,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public clinicalNote?: ProgNote | null,
    public assessmentId?: number | null,
    public assessment?: Assessment | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewProg = Omit<Prog, 'id'> & { id: null };
