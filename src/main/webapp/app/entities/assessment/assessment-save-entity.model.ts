import { Plan } from 'app/entities/plan/plan.model';
import { AggravationPain } from 'app/entities/assessment/aggravationPain.model';
import { SoapNote } from 'app/entities/soap-note/soap-note.model';
import { PainOnset } from '../painOnset.model';
import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';
export class AssessmentSaveEntity implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string | null,
    public painIntensity?: number | null,
    public sourcePain?: string | null,
    // this is symptom in table assess,ent
    public painOnSet?: PainOnset | null,
    public aggravationPain?: AggravationPain | null,
    public note?: string | null,
    public clientId?: number | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
    public createdDate?: dayjs.Dayjs | null,
    public plans?: Plan[] | null,
    public isBack?: boolean | null,
    public soapNote?: SoapNote | null,
  ) {}
}
