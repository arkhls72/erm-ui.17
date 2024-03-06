import { Condition } from 'app/entities/condition/condition.model';
import { Medication } from 'app/entities/medication/medication.model';
import { Operation } from 'app/entities/operation/operation.model';
import { Injury } from 'app/entities/injury/injury.model';
import { BaseEntity } from '../../../shared/model/base-entity';

export class MedicalClient implements BaseEntity {
  constructor(
    public id?: number,
    public clientId?: number,
    public conditions?: Condition[],
    public medications?: Medication[],
    public operations?: Operation[],
    public injuries?: Injury[],
    public createdBy?: string,
  ) {}
}
