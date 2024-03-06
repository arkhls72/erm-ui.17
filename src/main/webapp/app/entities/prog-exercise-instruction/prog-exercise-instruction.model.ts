import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';
import { Instruction } from '../instruction/instruction.model';

export class ProgExerciseInstruction implements BaseEntity {
  constructor(
    public id: number,
    public exerciseId?: number | null,
    public progId?: number | null,
    public instruction?: Instruction | null,
    public createdBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewProgExerciseInstruction = Omit<ProgExerciseInstruction, 'id'> & { id: null };
