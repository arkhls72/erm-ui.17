import { Component, Input } from '@angular/core';
import { Product } from 'app/entities/product/product.model';
import { SupplierEvent, SupplierEventType } from 'app/entities/local-share/supplier-event';
import { SupplierEventService } from 'app/entities/local-share/supplier-event.service';
import { ProductService } from '../../../product/service/product.service';

@Component({
  selector: 'bc-supplier-product-delete',
  templateUrl: './supplier-product-delete.component.html',
})
export class SupplierProductDeleteComponent {
  @Input()
  product!: Product;

  supplierEventType = SupplierEventType.PRODUCT_DELETE;

  constructor(
    protected productService: ProductService,
    protected eventService: SupplierEventService,
  ) {}

  cancel(): void {
    this.supplierEventType = SupplierEventType.BACK;
    this.eventService.publish(new SupplierEvent(SupplierEventType.BACK, 'supplier-product-tab'));
  }

  confirmDelete(id: number): void {
    this.productService.delete(id).subscribe(() => {
      this.supplierEventType = SupplierEventType.BACK;
      this.eventService.publish(new SupplierEvent(SupplierEventType.BACK, 'supplier-product-tab'));
    });
  }
}
