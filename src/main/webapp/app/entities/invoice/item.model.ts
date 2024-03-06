import { BaseEntity } from '../../shared/model/base-entity';

export class Item implements BaseEntity {
  constructor(
    public id?: number,
    public invoiceId?: number,
    //* item ID either is service.id or productInvoiceId
    public itemId?: number,
    public unitPrice?: number,
    public paymentAmount?: number,
    public name?: string,
    //* either product ID or ServiceId
    public psId?: number,
    // missing must be added.
    public psFeeId?: number,
    public psFeeTypeId?: number,
    //* either S: Service or P: Product
    public type?: string,
    public quantity?: number,
  ) {}
}
