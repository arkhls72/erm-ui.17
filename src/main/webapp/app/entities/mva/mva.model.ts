import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';
import { Coverage } from '../coverage/coverage.model';
import { Address } from '../address/address.model';

export class Mva implements BaseEntity {
  constructor(
    public id: number,
    public insurance?: string | null,
    public clientId?: number | null,
    public claimNumber?: string | null,
    public accidentDate?: dayjs.Dayjs | null,
    public adjuster?: string | null,
    public status?: string | null,
    public closeDate?: dayjs.Dayjs | null,
    public phoneExtension?: string | null,
    public cellPhone?: string | null,
    public fax?: string | null,
    public email?: string | null,
    public note?: string | null,
    public address?: Address | null,
    public addressId?: number | null,
    public coverages?: Coverage | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
    public phone?: string | null,
  ) {}
}

export type NewMva = Omit<Mva, 'id'> & { id: null };
