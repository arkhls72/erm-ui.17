import { Wsib } from 'app/entities/wsib/wsib.model';
import { Coverage } from 'app/entities/coverage/coverage.model';
import { Therapy } from 'app/entities/therapy/therapy.model';
import { Mva } from 'app/entities/mva/mva.model';
import { BaseEntity } from '../../shared/model/base-entity';

export class Claim implements BaseEntity {
  constructor(
    public id?: number,
    public clientId?: number,
    public isBack?: string,
    public wsibs?: Wsib[],
    public coverages?: Coverage[],
    public therapies?: Therapy[],
    public mvas?: Mva[],
    public mvaTherapies?: Therapy[],
  ) {}
}
