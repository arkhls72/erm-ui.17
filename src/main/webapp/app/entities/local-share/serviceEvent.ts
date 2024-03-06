import { Order } from 'app/entities/order/order.model';

export enum ServiceEventType {
  GENERAL_ADD,
  IMPORT_COMMON_SERVICE = 1,
  FEE_ADD,
  BACK = 3,
}
export class ServiceEvent {
  constructor(
    public type?: ServiceEventType,
    public productId?: number,
    public source?: string,
    public order?: Order,
  ) {}
}
