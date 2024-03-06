import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';
import { Assessment } from '../assessment/assessment.model';

export class SoapNote implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string | null,
    public subjective?: string | null,
    public objective?: string | null,
    public analysis?: string | null,
    public evaluation?: string | null,
    public intervention?: string | null,
    public clientId?: number | null,
    public assessments?: Assessment[] | null,
    public createdBy?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}
export type NewSoapNote = Omit<SoapNote, 'id'> & { id: null };
