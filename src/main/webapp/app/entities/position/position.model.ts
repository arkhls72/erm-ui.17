import { BaseEntity } from '../../shared/model/base-entity';
export class Position implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
  ) {}
}
export type NewPosition = Omit<Position, 'id'> & { id: null };
