import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class ExerGroup implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
    public description?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
  ) {}
}

export type NewExerGroup = Omit<ExerGroup, 'id'> & { id: null };
