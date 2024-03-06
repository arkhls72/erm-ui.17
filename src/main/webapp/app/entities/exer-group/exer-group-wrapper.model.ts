import { Exercise } from 'app/entities/exercise/exercise.model';
import { Instruction } from 'app/entities/instruction/instruction.model';
import { BaseEntity } from '../../shared/model/base-entity';

export class ExerGroupWrapper implements BaseEntity {
  constructor(
    public id?: number | null,
    public exercise?: Exercise,
    public exerciseId?: number,
    public instruction?: Instruction,
    public exerGroupId?: number,
    public exerGroupDetailId?: number,
  ) {}
}
