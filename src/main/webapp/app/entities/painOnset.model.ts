import { BaseEntity } from '../shared/model/base-entity';

export class PainOnset implements BaseEntity {
  constructor(
    public id?: number,
    public sudden?: boolean,
    public gradual?: boolean,
  ) {}
}
