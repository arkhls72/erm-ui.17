import { ExerciseMedia } from 'app/entities/exercise/exercise-media.model';
import { BaseEntity } from '../../shared/model/base-entity';
import { ProgExerciseInstruction } from '../prog-exercise-instruction/prog-exercise-instruction.model';
export class ExerciseMediaWrapper implements BaseEntity {
  constructor(
    public id?: number,
    public exerciseMedia?: ExerciseMedia,
    public tree?: ParentNode[],
    public progExerciseInstructions?: ProgExerciseInstruction[],
  ) {}
}
