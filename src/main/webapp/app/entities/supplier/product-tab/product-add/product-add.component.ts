import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from 'app/entities/product/product.model';
import { Supplier } from 'app/entities/supplier/supplier.model';
import { SupplierEvent, SupplierEventType } from 'app/entities/local-share/supplier-event';
import { SupplierEventService } from 'app/entities/local-share/supplier-event.service';
import { ProductService } from '../../../product/service/product.service';
import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from '../../../../config/input.constants';
import { Dayjs } from 'dayjs';

@Component({
  selector: 'bc-product-add',
  templateUrl: './product-add.component.html',
})
export class ProductAddComponent implements OnInit {
  @Input()
  supplier!: Supplier;
  supplierEventType = SupplierEventType.PRODUCT_ADD;

  isSaving = false;
  lastModifiedDateDp: any;
  product = {} as Product;
  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    description: [null, [Validators.required, Validators.maxLength(250)]],
    feeId: [],
    supplierId: [],
    itemPrice: [],
    quantity: [null, [Validators.required]],
    note: [null, [Validators.maxLength(350)]],
    lastOrderDate: [],
    createdBy: [],
    createdDate: [],
    lastModifiedBy: [],
    lastModifiedDate: [],
  });

  constructor(
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    protected eventService: SupplierEventService,
  ) {}

  ngOnInit(): void {
    if (!this.product.id) {
      const today = dayjs();
      this.product.lastOrderDate = today;
    }
    this.product.supplierId = this.supplier.id;
    this.updateForm(this.product);
  }

  updateForm(product: any): void {
    this.editForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      supplierId: product.supplierId,
      itemPrice: product.itemPrice,
      quantity: product.quantity,
      note: product.note,
      lastOrderDate: product.lastOrderDate ? product.lastOrderDate.format(DATE_TIME_FORMAT) : null,
      createdBy: product.createdBy,
      createdDate: product.createdDate ? product.createdDate.format(DATE_TIME_FORMAT) : null,
      lastModifiedBy: product.lastModifiedBy,
      lastModifiedDate: product.lastModifiedDate,
    });
  }

  cancel(): void {
    this.supplierEventType = SupplierEventType.BACK;
    this.eventService.publish(new SupplierEvent(SupplierEventType.BACK, 'supplier-product-tab'));
  }

  save(): void {
    this.isSaving = true;
    const product = <Product>this.createFromForm();
    if (product.id !== undefined) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  private createFromForm(): Product {
    const lastModifiedDate: any = this.editForm.get(['lastModifiedDate'])!.value
      ? (this.editForm.get(['lastModifiedDate'])!.value as Dayjs).format(DATE_TIME_FORMAT).toString()
      : null;

    const createdDate: any = this.editForm.get(['createdDate'])!.value
      ? (this.editForm.get(['createdDate'])!.value as Dayjs).format(DATE_TIME_FORMAT).toString()
      : null;

    const lastOrderDate: any = this.editForm.get(['lastOrderDate'])!.value
      ? (this.editForm.get(['lastOrderDate'])!.value as Dayjs).format(DATE_TIME_FORMAT).toString()
      : null;
    const product = {} as Product;
    (product.id = this.editForm.get(['id']) ? this.editForm.get(['id'])!.value : null),
      (product.name = this.editForm.get(['name'])!.value),
      (product.description = this.editForm.get(['description'])!.value),
      (product.supplierId = this.editForm.get(['supplierId'])!.value),
      (product.quantity = this.editForm.get(['quantity'])!.value),
      (product.itemPrice = this.editForm.get(['itemPrice'])!.value),
      (product.note = this.editForm.get(['note'])!.value),
      (product.lastOrderDate = lastOrderDate),
      (product.createdBy = this.editForm.get(['createdBy'])!.value),
      (product.createdDate = createdDate),
      (product.lastModifiedBy = this.editForm.get(['lastModifiedBy'])!.value),
      (product.lastModifiedDate = this.editForm.get(['lastModifiedDate'])!.value);

    return product;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Product>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res.body),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(res: any): void {
    this.isSaving = false;
    this.product = res;
    this.supplierEventType = SupplierEventType.PRODUCT_EDIT;
    this.eventService.publish(new SupplierEvent(SupplierEventType.PRODUCT_EDIT, 'supplier-product-general', this.product));
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
