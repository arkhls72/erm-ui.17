import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class Product implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
    public description?: string | null,
    public supplierId?: number | null,
    public quantity?: number | null,
    public itemPrice?: number | null,
    public note?: string | null,
    public lastOrderDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
    public emptyPrice?: boolean | null,
  ) {}
}

export type NewProduct = Omit<Product, 'id'> & { id: null };
