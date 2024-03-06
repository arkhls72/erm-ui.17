import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class PaymentInvoice implements BaseEntity {
  constructor(
    public id: number,
    public invoiceId?: number | null,
    public dueNow?: number | null,
    public status?: string | null,
    public note?: string | null,
    public createdBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewPaymentInvoice = Omit<PaymentInvoice, 'id'> & { id: null };
