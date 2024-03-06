import { Instruction } from 'app/entities/instruction/instruction.model';
import { ProgExerciseInstruction } from '../prog-exercise-instruction/prog-exercise-instruction.model';
import { BaseEntity } from '../../shared/model/base-entity';

export class ProgExerciseWrapper implements BaseEntity {
  constructor(
    public id?: number,
    public exerciseIds?: number[],
    public progId?: number,
    public progExerciseInstructions?: ProgExerciseInstruction[],
    public instructions?: Instruction[],
  ) {}
}
