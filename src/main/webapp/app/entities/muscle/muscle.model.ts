import { BaseEntity } from '../../shared/model/base-entity';

export class Muscle implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
  ) {}
}
export type NewMuscle = Omit<Muscle, 'id'> & { id: null };
