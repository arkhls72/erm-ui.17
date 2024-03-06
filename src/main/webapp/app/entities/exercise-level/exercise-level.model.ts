import { BaseEntity } from '../../shared/model/base-entity';

export class ExerciseLevel implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
  ) {}
}

export type NewExerciseLevel = Omit<ExerciseLevel, 'id'> & { id: null };
