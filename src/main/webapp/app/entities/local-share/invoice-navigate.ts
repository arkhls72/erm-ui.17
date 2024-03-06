export enum InvoiceNavigateType {
  FROM_INVOICE,
  FROM_PRODUCT,
  FROM_SERVICE,
}

export class InvoiceNavigate {
  constructor(public type?: InvoiceNavigateType) {}
}
