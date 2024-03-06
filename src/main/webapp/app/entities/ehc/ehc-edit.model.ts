import { EhcClient } from 'app/entities/ehc-client/ehc-client.model';
import { Ehc } from 'app/entities/ehc/ehc.model';
import { EhcEditStatus } from 'app/entities/ehc/ehc-edit-status.model';
import { BaseEntity } from '../../shared/model/base-entity';
export class EhcEdit implements BaseEntity {
  constructor(
    public id?: number,
    public primary?: Ehc,
    public dependents?: EhcClient[],
    public dependentStatuses?: EhcEditStatus[],
    public primaryDetail?: Ehc,
  ) {}
}
