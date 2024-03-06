import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';
import { PainOnset } from '../painOnset.model';
import { Plan } from '../plan/plan.model';
import { SoapNote } from '../soap-note/soap-note.model';
import { AggravationPain } from './aggravationPain.model';

export class Assessment implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
    public painIntensity?: number | null,
    public sourcePain?: string | null,
    public painOnSet?: PainOnset | null,
    public aggravationPain?: AggravationPain | null,
    public note?: string | null,
    public clientId?: number | null,
    public plans?: Plan[] | null,
    public isBack?: boolean | null,
    public soapNote?: SoapNote | null,
    public createdBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}

export type NewAssessment = Omit<Assessment, 'id'> & { id: null };
