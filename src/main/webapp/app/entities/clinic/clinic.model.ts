import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class Clinic implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
    public phone?: string | null,
    public fax?: string | null,
    public email?: string | null,
    public addressId?: number | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewClinic = Omit<Clinic, 'id'> & { id: null };
