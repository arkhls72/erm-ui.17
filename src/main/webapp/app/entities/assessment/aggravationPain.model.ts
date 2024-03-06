import { BaseEntity } from '../../shared/model/base-entity';

export class AggravationPain implements BaseEntity {
  constructor(
    public id?: number,
    public sharp?: boolean,
    public throbbing?: boolean,
  ) {}
}
