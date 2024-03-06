import { Order } from 'app/entities/order/order.model';

export enum OrderEventType {
  ORDER_LIST,
  PRODUCT_ADD = 1,
  ORDER_PRODUCT_LIST = 2,
  ORDER_PAYMENT = 3,
  ORDER_PLACEMENT,
  ORDER_DELETE = 5,
  BACK = 6,
}
export class OrderEvent {
  constructor(
    public type?: OrderEventType,
    public productId?: number,
    public source?: string,
    public order?: Order,
  ) {}
}
