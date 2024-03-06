import { BaseEntity } from '../../shared/model/base-entity';
import dayjs from 'dayjs/esm';
import { Injury } from '../injury/injury.model';

export class Instruction implements BaseEntity {
  constructor(
    public id?: number,
    public repeat?: number | null,
    public hold?: number | null,
    public complete?: number | null,
    public perform?: number | null,
    public note?: string | null,
    public durationNumber?: number | null,
    public duration?: string | null,
    public name?: string | null,
    public exerciseId?: number | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
  ) {}
}
export type NewInstruction = Omit<Instruction, 'id'> & { id: null };
