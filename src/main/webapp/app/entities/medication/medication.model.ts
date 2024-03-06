import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class Medication implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
    public reasonFor?: string | null,
    public note?: string | null,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
  ) {}
}

export type NewMedication = Omit<Medication, 'id'> & { id: null };
