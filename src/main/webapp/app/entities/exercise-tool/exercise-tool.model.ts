import { BaseEntity } from '../../shared/model/base-entity';

export class ExerciseTool implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
  ) {}
}

export type NewExerciseTool = Omit<ExerciseTool, 'id'> & { id: null };
