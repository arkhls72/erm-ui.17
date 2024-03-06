import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class ServiceInvoice implements BaseEntity {
  constructor(
    public id: number,
    public invoiceId?: number | null,
    public invoicePrice?: number | null,
    public myServiceId?: number | null,
    public myServiceFeeId?: number | null,
    public quantity?: number | null,
    public status?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
  ) {}
}
export type NewServiceInvoice = Omit<ServiceInvoice, 'id'> & { id: null };
