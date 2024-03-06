import { Order } from 'app/entities/order/order.model';
import { OrderPayment } from 'app/entities/order-payment/order-payment.model';
import { BaseEntity } from '../../shared/model/base-entity';

export class OrderPaymentUpdate implements BaseEntity {
  constructor(
    public id?: number | null,
    public order?: Order | null,
    public orderPayment?: OrderPayment | null,
  ) {}
}
