import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

export class ProgNote implements BaseEntity {
  constructor(
    public id: number,
    public progId?: number | null,
    public note?: string | null,
    public createdBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}
export type NewProgNote = Omit<ProgNote, 'id'> & { id: null };
