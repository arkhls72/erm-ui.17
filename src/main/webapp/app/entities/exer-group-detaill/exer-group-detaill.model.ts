import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';
import { Exercise } from '../exercise/exercise.model';

export class ExerGroupDetaill implements BaseEntity {
  constructor(
    public id: number | null,
    public exerGroupId?: number | null,
    public exercise?: Exercise | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
  ) {}
}

export type NewExerGroupDetaill = Omit<ExerGroupDetaill, 'id'> & { id: null };
