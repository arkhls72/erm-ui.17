import { MyServiceFee } from 'app/entities/my-service-fee/my-service-fee.model';
import { FeeType } from 'app/entities/fee-type/fee-type.model';
import { MyService } from 'app/entities/my-service/my-service.model';
import { BaseEntity } from '../../shared/model/base-entity';

export class MyServiceDetail implements BaseEntity {
  constructor(
    public id?: number,
    public myServices?: MyService[],
    public myServiceFees?: MyServiceFee[],
    public feeTypes?: FeeType[],
  ) {}
}
