import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class ProductOrder implements BaseEntity {
  constructor(
    public id: number,
    public myProductId?: number | null,
    public orderId?: number | null,
    public orderPrice?: number | null,
    public quantity?: number | null,
    public status?: string | null,
    public createdBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewProductOrder = Omit<ProductOrder, 'id'> & { id: null };
