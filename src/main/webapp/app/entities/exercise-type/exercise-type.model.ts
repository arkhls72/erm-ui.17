import { BaseEntity } from '../../shared/model/base-entity';

export class ExerciseType implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
  ) {}
}

export type NewExerciseType = Omit<ExerciseType, 'id'> & { id: null };
