import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class Order implements BaseEntity {
  constructor(
    public id: number,

    public orderDate?: dayjs.Dayjs | null,
    public subTotal?: number | null,
    public taxTotal?: number | null,
    public status?: string | null,
    public note?: string | null,
    public createdBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewOrder = Omit<Order, 'id'> & { id: null };
