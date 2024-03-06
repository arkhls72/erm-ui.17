import { BaseEntity } from '../../shared/model/base-entity';

export class ProgExerciseWrapper implements BaseEntity {
  constructor(
    public id?: number,
    public progId?: number,
    public exerciseIds?: number[],
    public instructionIds?: number[],
  ) {}
}
