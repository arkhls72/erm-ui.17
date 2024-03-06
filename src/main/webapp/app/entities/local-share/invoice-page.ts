export enum InvoicePageType {
  INVOICE,
  PAYMENT,
  INVOICE_LIST,
  INVOICE_DELETE = 3,
}

export class InvoicePage {
  constructor(public type?: InvoicePageType) {}
}
