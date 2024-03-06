import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class Injury implements BaseEntity {
  constructor(
    public id: number,
    public nameType?: string | null,
    public happenDate?: dayjs.Dayjs | null,
    public note?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewInjury = Omit<Injury, 'id'> & { id: null };
