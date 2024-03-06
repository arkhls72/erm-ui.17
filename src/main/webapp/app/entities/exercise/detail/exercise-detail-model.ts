import { Muscle } from 'app/entities/muscle/muscle.model';
import { ExerciseType } from 'app/entities/exercise-type/exercise-type.model';
import { Movement } from 'app/entities/movement/movement.model';
import { ExerciseTool } from 'app/entities/exercise-tool/exercise-tool.model';
import { BodyPart } from 'app/entities/body-part/body-part.model';
import { Position } from 'app/entities/position/position.model';
import { BaseEntity } from '../../../shared/model/base-entity';

export class ExerciseDetail implements BaseEntity {
  constructor(
    public id?: number,
    public bodyParts?: BodyPart[],
    public tools?: ExerciseTool[],
    public movements?: Movement[],
    public types?: ExerciseType[],
    public muscles?: Muscle[],
    public positions?: Position[],
  ) {}
}
