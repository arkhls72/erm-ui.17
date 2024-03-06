import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';
import { Province } from '../province/province.model';
import { Countries } from '../countries/countries.model';

export class Address implements BaseEntity {
  constructor(
    public id: number,
    public streetNumber?: string | null,
    public streetName?: string | null,
    public unitNumber?: string | null,
    public postalCode?: string | null,
    public city?: string | null,
    public province?: Province | null,
    public countries?: Countries | null,
    public poBox?: string | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
  ) {}
}

export type NewAddress = Omit<Address, 'id'> & { id: null };
