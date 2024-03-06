import { Ehc } from 'app/entities/ehc/ehc.model';
import { Coverage } from 'app/entities/coverage/coverage.model';
import { Therapy } from 'app/entities/therapy/therapy.model';
import { EhcClient } from 'app/entities/ehc-client/ehc-client.model';
import { EhcSummary } from 'app/entities/ehc/ehcSummary.model';
import { PrimaryDependent } from 'app/entities/client/primary-dependent.model';
import { BaseEntity } from '../../shared/model/base-entity';

export class InsuranceClient implements BaseEntity {
  constructor(
    public id?: number,
    public clientId?: number,
    public ehces?: Ehc[],
    public coverages?: Coverage[],
    public therapies?: Therapy[],
    public myInsurances?: EhcClient[],
    public ehcSummary?: EhcSummary,
    public dependents?: PrimaryDependent[],
    public isBack?: string,
  ) {}
}
