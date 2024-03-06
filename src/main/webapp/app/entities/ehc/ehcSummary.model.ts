import { Ehc } from 'app/entities/ehc/ehc.model';
import { BaseEntity } from '../../shared/model/base-entity';
export class EhcSummary implements BaseEntity {
  constructor(
    public id?: number,
    public primaries?: Ehc[],
    public secondaries?: Ehc[],
  ) {}
}
