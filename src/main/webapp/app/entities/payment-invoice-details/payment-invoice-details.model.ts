import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class PaymentInvoiceDetails implements BaseEntity {
  constructor(
    public id: number,
    public paymentInvoiceId?: number | null,
    public paymentAmount?: number | null,
    public paymentMethod?: string | null,
    public cardNumber?: string | null,
    public note?: string | null,
    public createdBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewPaymentInvoiceDetails = Omit<PaymentInvoiceDetails, 'id'> & { id: null };
