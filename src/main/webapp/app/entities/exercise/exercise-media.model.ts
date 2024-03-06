import { Exercise } from 'app/entities/exercise/exercise.model';
import { Media } from 'app/entities/media/media.model';
import { BaseEntity } from '../../shared/model/base-entity';
export class ExerciseMedia implements BaseEntity {
  constructor(
    public id?: number,
    public exercises?: Exercise[],
    public medias?: Media[],
  ) {}
}
