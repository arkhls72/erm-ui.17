import { GroupExerciseMedia } from 'app/entities/exercise/group-exercise-media.model';
import { ProgGroupInstruction } from 'app/entities/prog-group-instruction/prog-group-instruction.model';
import { BaseEntity } from '../../shared/model/base-entity';

export class GroupExerciseMediaWrapper implements BaseEntity {
  constructor(
    public id?: number,
    public groupExerciseMedias?: GroupExerciseMedia[],
    public tree?: ParentNode[],
    public progGroupInstructions?: ProgGroupInstruction[],
  ) {}
}
