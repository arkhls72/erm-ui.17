import dayjs from 'dayjs/esm';
import { BaseEntity } from '../../shared/model/base-entity';

// export interface Wsib {
//   id: number;
//   employer?: string | null;
//   claimNumber?: string | null;
//   clientId?: number | null;
//   supervisor?: string | null;
//   accidentDate?: dayjs.Dayjs | null;
//   adjudicator?: string | null;
//   caseManager?: string | null;
//   status?: string | null;
//   phone?: string | null;
//   phoneExtension?: string | null;
//   cellPhone?: string | null;
//   closeDate?: dayjs.Dayjs | null;
//   note?: string | null;
//   fax?: string | null;
//   coverages?: number | null;
//   email?: string | null;
//   addressId?: number | null;
//   lastModifiedBy?: string | null;
//   lastModifiedDate?: dayjs.Dayjs | null;
// }
export class Wsib implements BaseEntity {
  constructor(
    public id?: number,
    public employer?: string | null,
    public claimNumber?: string | null,
    public clientId?: number | null,
    public supervisor?: string | null,
    public accidentDate?: dayjs.Dayjs | null,
    public adjudicator?: string | null,
    public caseManager?: string | null,
    public status?: string | null,
    public phone?: string | null,
    public phoneExtension?: string | null,
    public cellPhone?: string | null,
    public closeDate?: dayjs.Dayjs | null,
    public note?: string | null,
    public fax?: string | null,
    public coverages?: number | null,
    public email?: string | null,
    public addressId?: number | null,
    public lastModifiedBy?: string | null,
    public lastModifiedDate?: dayjs.Dayjs | null,
  ) {}
}
export type NewWsib = Omit<Wsib, 'id'> & {
  id: null;
  //  employer?: string | null,
  // claimNumber?: string | null,
  //  clientId?: number | null,
  // supervisor?: string | null,
  // accidentDate?: dayjs.Dayjs | null,
  // adjudicator?: string | null,
  // caseManager?: string | null,
  // status?: string | null,
  // phone?: string | null,
  // phoneExtension?: string | null,
  // cellPhone?: string | null,
  // closeDate?: dayjs.Dayjs | null,
  // note?: string | null,
  // fax?: string | null,
  // coverages?: number | null,
  // email?: string | null,
  // addressId?: number | null,
  // lastModifiedBy?: string | null,
  // lastModifiedDate?: dayjs.Dayjs | null
};
