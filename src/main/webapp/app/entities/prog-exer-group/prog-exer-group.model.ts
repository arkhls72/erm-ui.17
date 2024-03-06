import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class ProgExerGroup implements BaseEntity {
  constructor(
    public id: number,
    public exerGroupId?: number | null,
    public progId?: number | null,
    public createdBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewProgExerGroup = Omit<ProgExerGroup, 'id'> & { id: null };
