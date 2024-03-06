import { FeeType } from 'app/entities/fee-type/fee-type.model';
import { ProductInvoice } from 'app/entities/product-invoice/product-invoice.model';
import { MyProductFee } from 'app/entities/my-product-fee/my-product-fee.model';
import { BaseEntity } from '../../shared/model/base-entity';
export class ModifyProductItem implements BaseEntity {
  constructor(
    public id?: number,
    public productInvoice?: ProductInvoice,
    public action?: boolean,
    public selectedProductFees?: MyProductFee[],
    public feeTypes?: FeeType[],
    public name?: string,
    public quantity?: number,
  ) {}
}
