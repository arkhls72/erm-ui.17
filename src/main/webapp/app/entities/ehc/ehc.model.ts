import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';
import { Coverage } from '../coverage/coverage.model';
import { EhcClient } from '../ehc-client/ehc-client.model';
import { PrimaryDependent } from '../client/primary-dependent.model';

export class Ehc implements BaseEntity {
  constructor(
    public id: number,
    public clientId?: number,
    public certificateNumber?: string | null,
    public policyNumber?: string | null,
    public policyHolder?: string | null,
    public groupNumber?: string | null,
    public name?: string | null,
    public note?: string | null,
    public type?: string,
    public status?: string | null,
    public endDate?: dayjs.Dayjs | null,
    public phone?: string | null,
    public fax?: string | null,
    public email?: string | null,
    public addressId?: number | null,
    public coverages?: Coverage[] | null,
    public ehcClient?: EhcClient | null,
    public dependents?: PrimaryDependent[],
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewEhc = Omit<Ehc, 'id'> & { id: null };
