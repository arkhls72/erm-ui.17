import { BodyPart } from 'app/entities/body-part/body-part.model';

import { Movement } from 'app/entities/movement/movement.model';
import { Position } from 'app/entities/position/position.model';

import { Muscle } from 'app/entities/muscle/muscle.model';
import { ExerciseType } from 'app/entities/exercise-type/exercise-type.model';
import { ExerciseTool } from 'app/entities/exercise-tool/exercise-tool.model';
import { BaseEntity } from '../../shared/model/base-entity';
import dayjs from 'dayjs/esm';
import { Coverage } from '../coverage/coverage.model';

export class Exercise implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string | null,
    public bodyPart?: BodyPart | null,
    public muscle?: Muscle | null,
    public type?: ExerciseType | null,
    public position?: Position | null,
    public movement?: Movement | null,
    public tool?: ExerciseTool | null,
    public mediaId?: any,
    public description?: string | null,
    public firstMediaId?: number | null,
    public secondMediaId?: number | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
    public createdDate?: dayjs.Dayjs | null,
    public createdBy?: string | null,
  ) {}
}
export type NewExercise = Omit<Exercise, 'id'> & { id: null };
