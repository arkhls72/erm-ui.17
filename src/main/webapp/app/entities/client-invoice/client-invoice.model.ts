import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class ClientInvoice implements BaseEntity {
  constructor(
    public id: number,
    public invoiceId?: number | null,
    public invoicePrice?: number | null,
    public productId?: number | null,
    public myServiceId?: number | null,
    public quantity?: number | null,
    public status?: string | null,
    public createdBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewClientInvoice = Omit<ClientInvoice, 'id'> & { id: null };
