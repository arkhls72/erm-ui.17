import { BaseEntity } from '../../shared/model/base-entity';

export class Condition implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
  ) {}
}

export type NewCondition = Omit<Condition, 'id'> & { id: null };
