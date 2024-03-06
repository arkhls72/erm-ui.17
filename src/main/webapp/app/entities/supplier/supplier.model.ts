import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';
export class Supplier implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string | null,
    public contactName?: string | null,
    public phone?: string | null,
    public addressId?: number | null,
    public email?: string | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}
export type NewSupplier = Omit<Supplier, 'id'> & { id: null };
