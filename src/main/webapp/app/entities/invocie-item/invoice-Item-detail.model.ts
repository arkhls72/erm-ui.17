import { Item } from 'app/entities/invoice/item.model';
import { MyServiceFee } from 'app/entities/my-service-fee/my-service-fee.model';
import { FeeType } from 'app/entities/fee-type/fee-type.model';
import { MyProductFee } from 'app/entities/my-product-fee/my-product-fee.model';
import { Invoice } from 'app/entities/invoice/invoice.model';
import { BaseEntity } from '../../shared/model/base-entity';
export class InvoiceItemDetail implements BaseEntity {
  constructor(
    public id?: number,
    public invoice?: Invoice,
    public items?: Item[],
    public myServiceFees?: MyServiceFee[],
    public myProductFees?: MyProductFee[],
    public feeTypes?: FeeType[],
  ) {}
}
