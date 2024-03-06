import { BaseEntity } from '../../../shared/model/base-entity';

export class ShortProductFee implements BaseEntity {
  constructor(
    public id?: number | null,
    public fee?: number | null,
    public feeTypeId?: number | null,
  ) {}
}
