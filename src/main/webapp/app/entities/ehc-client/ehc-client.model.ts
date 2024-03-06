import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';
import { EhcPrimary } from '../ehc-primary/ehc-primary.model';

export class EhcClient implements BaseEntity {
  constructor(
    public id: number,
    public ehcType?: string,
    public policyHolder?: string | null,
    public clientId?: number,
    public ehcId?: number,
    // EhcClient has no endDate . This is place holder to pass around the value
    public endDate?: dayjs.Dayjs | null,
    // this is only place holder in angular side
    public primary?: EhcPrimary,

    public ehcPrimaryId?: number | null,
    public note?: string | null,
    public relation?: string,
    public status?: string,
    public removedDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewEhcClient = Omit<EhcClient, 'id'> & { id: null };
