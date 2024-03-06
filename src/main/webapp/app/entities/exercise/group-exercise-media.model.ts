import { ExerciseMedia } from 'app/entities/exercise/exercise-media.model';
import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { BaseEntity } from '../../shared/model/base-entity';

export class GroupExerciseMedia implements BaseEntity {
  constructor(
    public id?: number,
    public groupId?: number | null,
    public exerGroup?: ExerGroup | null,
    public exerciseMedia?: ExerciseMedia,
  ) {}
}
