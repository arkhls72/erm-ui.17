import { Product } from 'app/entities/product/product.model';

export enum SupplierEventType {
  PRODUCT_LIST,
  PRODUCT_ADD,
  PRODUCT_DELETE,
  PRODUCT_EDIT = 3,
  PRODUCT_SPEC = 4,
  PRODUCT_FEE,
  BACK = 6,
}

export class SupplierEvent {
  constructor(
    public type?: SupplierEventType,
    public source?: string,
    public product?: Product,
  ) {}
}
