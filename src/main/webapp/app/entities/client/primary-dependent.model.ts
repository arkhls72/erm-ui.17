import { Ehc } from 'app/entities/ehc/ehc.model';
import { Coverage } from 'app/entities/coverage/coverage.model';
import { Therapy } from 'app/entities/therapy/therapy.model';
import { EhcPrimary } from 'app/entities/ehc-primary/ehc-primary.model';
import { EhcClient } from 'app/entities/ehc-client/ehc-client.model';
import { EhcSummary } from 'app/entities/ehc/ehcSummary.model';
import { BaseEntity } from '../../shared/model/base-entity';

export class PrimaryDependent implements BaseEntity {
  constructor(
    public id?: number,
    public clientId?: number,
    public ehcId?: number,
    public dependentName?: string,
  ) {}
}
