import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class Invoice implements BaseEntity {
  constructor(
    public id: number,
    public clientId?: number | null,
    public invoiceNumber?: string | null,
    public clinicId?: number | null,
    public status?: string | null,
    public taxTotal?: number | null,
    public subTotal?: number | null,
    public note?: string | null,
    public fullName?: string | null,
    public grandTotal?: number | null,
    public createdBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewInvoice = Omit<Invoice, 'id'> & { id: null };
