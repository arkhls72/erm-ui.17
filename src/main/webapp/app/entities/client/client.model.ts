import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';
import { Address } from '../address/address.model';

export class Client implements BaseEntity {
  constructor(
    public id: number,
    public firstName?: string | null,
    public lastName?: string | null,
    public birthDate?: dayjs.Dayjs | null,
    public homePhone?: string | null,
    public cellPhone?: string | null,
    public email?: string | null,
    public address?: Address | null,
    public gender?: string | null,
    public howHear?: string | null,
    public emergencyName?: string | null,
    public emergencyPhone?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public phoneExtension?: string | null,
  ) {}
}

export type NewClient = Omit<Client, 'id'> & { id: null };
