import { Plan } from 'app/entities/plan/plan.model';
import { Prog } from 'app/entities/prog/prog.model';
import { BaseEntity } from '../../../shared/model/base-entity';
export class TreatmentProgram implements BaseEntity {
  constructor(
    public id?: number,
    public clientId?: number,
    public treatments?: Plan[],
    public programs?: Prog[],
    public isBack?: string,
  ) {}
}
