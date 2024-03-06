import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class ProductInvoice implements BaseEntity {
  constructor(
    public id: number | number,
    public invoiceId?: number | null,
    public myProductId?: number | null,
    public myProductFeeId?: number | null,
    public invoicePrice?: number | null,
    public quantity?: number | null,
    public status?: string | null,
    public createdBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewProductInvoice = Omit<ProductInvoice, 'id'> & { id: null };
