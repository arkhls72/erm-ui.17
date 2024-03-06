import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class OrderPayment implements BaseEntity {
  constructor(
    public id: number,
    public orderId?: number | null,
    public totalPrice?: number | null,
    public credit?: number | null,
    public debit?: number | null,
    public eTransfer?: number | null,
    public moneyEmail?: number | null,
    public directDeposit?: number | null,
    public cash?: number | null,
    public cheque?: number | null,
    public createdBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewOrderPayment = Omit<OrderPayment, 'id'> & { id: null };
