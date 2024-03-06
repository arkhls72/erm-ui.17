import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class Operation implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
    public operationDate?: dayjs.Dayjs | null,
    public reasonFor?: string | null,
    public note?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewOperation = Omit<Operation, 'id'> & { id: null };
