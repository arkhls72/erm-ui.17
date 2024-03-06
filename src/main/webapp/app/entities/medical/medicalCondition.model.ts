import { BaseEntity } from '../../shared/model/base-entity';

export class MedicalCondition implements BaseEntity {
  constructor(
    public id?: number,
    public clientId?: number,
    public conditionIds?: number[],
  ) {}
}
