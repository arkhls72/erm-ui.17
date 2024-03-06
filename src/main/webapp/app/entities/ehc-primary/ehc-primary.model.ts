import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class EhcPrimary implements BaseEntity {
  constructor(
    public id: number,
    public ehcId?: number | null,
    public clientId?: number | null,
    public name?: string | null,
    public status?: string | null,
    public ehcType?: string | null,
    public groupNumber?: string | null,
    public policyNumber?: string | null,
    public policyHolder?: string | null,
    public certificateNumber?: string | null,
    public note?: string | null,
    public endDate?: dayjs.Dayjs | null,
    public phone?: string | null,
    public fax?: string | null,
    public email?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
  ) {}
}

export type NewEhcPrimary = Omit<EhcPrimary, 'id'> & { id: null };
