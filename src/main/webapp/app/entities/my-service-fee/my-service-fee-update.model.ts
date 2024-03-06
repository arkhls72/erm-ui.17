import { MyServiceFee } from 'app/entities/my-service-fee/my-service-fee.model';
import { BaseEntity } from '../../shared/model/base-entity';
export class MyServiceFeeUpdate implements BaseEntity {
  constructor(
    public id?: number | null,
    public myServiceFees: MyServiceFee[] = [],
  ) {}
}
