import { BaseEntity } from '../../shared/model/base-entity';

export class BodyPart implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
  ) {}
}

export type NewBodyPart = Omit<BodyPart, 'id'> & { id: null };
