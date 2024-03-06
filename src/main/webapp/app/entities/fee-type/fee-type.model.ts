import { BaseEntity } from '../../shared/model/base-entity';

export class FeeType implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
  ) {}
}

export type NewFeeType = Omit<FeeType, 'id'> & { id: null };
