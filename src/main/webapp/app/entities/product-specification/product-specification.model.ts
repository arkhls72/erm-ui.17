import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class ProductSpecification implements BaseEntity {
  constructor(
    public id: number,
    public mediaId?: number | null,
    public make?: string | null,
    public modelNumber?: string | null,
    public serialNumber?: string | null,
    public barcodeMediaId?: string | null,
    public productId?: number | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewProductSpecification = Omit<ProductSpecification, 'id'> & { id: null };
