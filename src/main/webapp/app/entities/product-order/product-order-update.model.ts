import { ProductOrder } from 'app/entities/product-order/product-order.model';
import { BaseEntity } from '../../shared/model/base-entity';
export class ProductOrderUpdate implements BaseEntity {
  constructor(
    public id?: number | null,
    public orderId?: number | null,
    public note?: string | null,
    public productOrders?: ProductOrder[] | null,
  ) {}
}
