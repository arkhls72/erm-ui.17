import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class MyProductFee implements BaseEntity {
  constructor(
    public id: number,
    public fee?: number | null,
    public feeTypeId?: number | null,
    public feeTypeName?: string | null,
    public myProductId?: number | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewMyProductFee = Omit<MyProductFee, 'id'> & { id: null };
