import { BaseEntity } from '../../shared/model/base-entity';

export class ExerGroupDetailWrapper implements BaseEntity {
  constructor(
    public id?: number | null,
    public exerGroupId?: number | null,
    public exerciseIds?: number[] | null,
    public exerGroupDetailMap?: Map<number, number>,
  ) {}
}
