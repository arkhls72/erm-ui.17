import { Injectable } from '@angular/core';
import { MyService } from 'app/entities/my-service/my-service.model';
import { ServiceInvoice } from 'app/entities/service-invoice/service-invoice.model';
import { Item } from 'app/entities/invoice/item.model';
import { Product } from 'app/entities/product/product.model';
import { ProductInvoice } from 'app/entities/product-invoice/product-invoice.model';
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  //* checked services
  public myServiceSelectedKey = '1.my-service-selected';
  public myServiceSelectedPersistKey = '2.my-service-selected-persist';
  public serviceInInvoiceKey = '3.service-in-invoice';

  public itemPersist = '4.item-persist';

  public selectedProductKey = '5.product-selected';
  public productSelectedPersistKey = '6.product-selected-persist';
  public productInInvoiceKey = '7.product-in-invoice';

  public navType = 'nav-type';

  cleanUpLocalStorage() {
    localStorage.removeItem(this.myServiceSelectedKey);
    localStorage.removeItem(this.myServiceSelectedPersistKey);
    localStorage.removeItem(this.serviceInInvoiceKey);

    localStorage.removeItem(this.itemPersist);

    localStorage.removeItem(this.selectedProductKey);
    localStorage.removeItem(this.productSelectedPersistKey);
    localStorage.removeItem(this.productInInvoiceKey);

    localStorage.removeItem(this.navType);
  }

  //* *****************************************************  MyService Caching  ************************************************************
  getMyServiceSelected(): MyService[] {
    return JSON.parse(localStorage.getItem(this.myServiceSelectedKey) as string);
  }

  //* add  checked services
  addMyServiceSelected(source: MyService[] | null) {
    localStorage.removeItem(this.myServiceSelectedKey);
    localStorage.setItem(this.myServiceSelectedKey, JSON.stringify(source));
  }

  getMyServiceSelectedPersists(): MyService[] {
    return JSON.parse(localStorage.getItem(this.myServiceSelectedPersistKey) as string);
  }

  //* add default persisted checked services
  addMyServiceSelectedPersists(source: MyService[]) {
    localStorage.removeItem(this.myServiceSelectedPersistKey);
    localStorage.setItem(this.myServiceSelectedPersistKey, JSON.stringify(source));
  }

  //* *****************************************************  ServiceInvoice Caching  ************************************************************

  getServiceInInvoice(): ServiceInvoice[] {
    return JSON.parse(localStorage.getItem(this.serviceInInvoiceKey) as string);
  }

  addServiceInInvoice(source?: ServiceInvoice[]) {
    localStorage.removeItem(this.serviceInInvoiceKey);
    localStorage.setItem(this.serviceInInvoiceKey, JSON.stringify(source));
  }

  //* *****************************************************  Item   *****************************************************************
  getItemInvoicePersist(): Item[] {
    return JSON.parse(localStorage.getItem(this.itemPersist) as string);
  }
  //* keeps only persisted ServiceInvoice.
  addItemInvoicePersist(source?: Item[]) {
    localStorage.removeItem(this.itemPersist);
    localStorage.setItem(this.itemPersist, JSON.stringify(source));
  }

  //* *****************************************************  PRODUCT   *****************************************************************

  getProductSelected(): [] {
    return JSON.parse(localStorage.getItem(this.selectedProductKey) as string);
  }

  addProductSelected(source?: Product[]) {
    localStorage.removeItem(this.selectedProductKey);
    localStorage.setItem(this.selectedProductKey, JSON.stringify(source));
  }

  //* default persisted checked services
  getProductSelectedPersist(): Product[] {
    return JSON.parse(localStorage.getItem(this.productSelectedPersistKey) as string);
  }

  //* add default persisted checked services
  addProductSelectedPersist(source?: Product[]) {
    localStorage.removeItem(this.productSelectedPersistKey);
    localStorage.setItem(this.productSelectedPersistKey, JSON.stringify(source));
  }

  getProductInInvoice(): ProductInvoice[] {
    return JSON.parse(localStorage.getItem(this.productInInvoiceKey) as string);
  }

  addProductInInvoice(source?: ProductInvoice[]) {
    localStorage.removeItem(this.productInInvoiceKey);
    localStorage.setItem(this.productInInvoiceKey, JSON.stringify(source));
  }
  // telling where is the flow coming from : add Service or add product page
  // FROM_INVOICE 0 : startup clicking on invoice id and goes to invoiceDetail page
  // FROM_PRODUCT 1,
  // FROM_SERVICE 2,
  getNavType(): string {
    return JSON.parse(localStorage.getItem(this.navType) as string);
  }
  // at the startup exactly when line of Invocies are clicked will be set to 0 (from Invoice) in invoice.route.ts
  // and
  addNavType(source?: string) {
    localStorage.removeItem(this.navType);
    localStorage.setItem(this.navType, JSON.stringify(source));
  }
}
