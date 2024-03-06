import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class MyServiceFee implements BaseEntity {
  constructor(
    public id: number,
    public fee?: number | null,
    public feeTypeId?: number | null,
    public myServiceId?: number | null,
    public note?: string | null,
    public createdBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewMyServiceFee = Omit<MyServiceFee, 'id'> & { id: null };
