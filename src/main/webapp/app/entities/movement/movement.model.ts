import { BaseEntity } from '../../shared/model/base-entity';

export class Movement implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
  ) {}
}

export type NewMovement = Omit<Movement, 'id'> & { id: null };
