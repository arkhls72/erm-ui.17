import { FeeType } from 'app/entities/fee-type/fee-type.model';
import { Product } from 'app/entities/product/product.model';
import { MyProductFee } from 'app/entities/my-product-fee/my-product-fee.model';
import { BaseEntity } from '../../shared/model/base-entity';
export class ProductDetail implements BaseEntity {
  constructor(
    public id?: number,
    public products?: Product[],
    public myProductFees?: MyProductFee[],
    public feeTypes?: FeeType[],
  ) {}
}
