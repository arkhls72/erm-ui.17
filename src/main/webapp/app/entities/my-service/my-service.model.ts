import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class MyService implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
    public description?: string | null,
    public commonServiceCodeId?: number | null,
    public commonServiceCode?: number | null,
    public unit?: string | null,
    public note?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: dayjs.Dayjs | null,
    public emptyPrice?: boolean | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewMyService = Omit<MyService, 'id'> & { id: null };
