import { ServiceInvoice } from 'app/entities/service-invoice/service-invoice.model';

import { FeeType } from 'app/entities/fee-type/fee-type.model';
import { BaseEntity } from '../../shared/model/base-entity';
import { MyServiceFee } from '../my-service-fee/my-service-fee.model';
export class ModifyServiceItem implements BaseEntity {
  constructor(
    public id?: number,
    public serviceInvoice?: ServiceInvoice,
    public action?: boolean,
    public selectedMyServiceFees?: MyServiceFee[],
    public feeTypes?: FeeType[],
    public name?: string,
    public quantity?: number,
  ) {}
}
