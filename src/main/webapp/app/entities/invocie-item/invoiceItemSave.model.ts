import { ServiceInvoice } from 'app/entities/service-invoice/service-invoice.model';
import { ProductInvoice } from 'app/entities/product-invoice/product-invoice.model';
import { BaseEntity } from '../../shared/model/base-entity';
export class InvoiceItemSave implements BaseEntity {
  constructor(
    public id?: number,
    public invoiceId?: number,
    public serviceInvoices?: ServiceInvoice[],
    public productInvoices?: ProductInvoice[],
  ) {}
}
