import { BaseEntity } from '../../shared/model/base-entity';

export class WrapperProg implements BaseEntity {
  constructor(
    public id?: number,
    public progExerGroupIds?: number[],
    public exerGroupIds?: number[],
  ) {}
}
