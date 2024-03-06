import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from 'app/entities/product/product.model';
import { Dayjs } from 'dayjs';
import { ProductService } from '../../../../product/service/product.service';
import { DATE_TIME_FORMAT } from '../../../../../config/input.constants';

@Component({
  selector: 'bc-supplier-product-general',
  templateUrl: './supplier-product-general.component.html',
})
export class SupplierProductGeneralComponent implements OnInit {
  isSaving = false;
  lastModifiedDateDp: any;
  lastOrderDateDp: any;
  @Input()
  product!: Product;
  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    description: [null, [Validators.required, Validators.maxLength(250)]],
    feeId: [],
    supplierId: [],
    orderPrice: [],
    quantity: [null, [Validators.required]],
    note: [null, [Validators.maxLength(250)]],
    lastOrderDate: [],
    createdBy: [],
    createdDate: [],
    lastModifiedBy: [],
    lastModifiedDate: [],
  });

  constructor(
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.updateForm(this.product);
  }

  updateForm(product: any): void {
    this.editForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      supplierId: product.supplierId,
      quantity: product.quantity,
      orderPrice: product.itemPrice,
      note: product.note,
      lastOrderDate: product.lastOrderDate ? product.lastOrderDate.format(DATE_TIME_FORMAT) : null,
      createdBy: product.createdBy,
      createdDate: product.createdDate ? product.createdDate.format(DATE_TIME_FORMAT) : null,
      lastModifiedBy: product.lastModifiedBy,
      lastModifiedDate: product.lastModifiedDate ? product.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.createFromForm();
    if (product.id !== undefined) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  private createFromForm(): Product {
    const product = {} as Product;

    const lastModifiedDate: any = this.editForm.get(['lastModifiedDate'])!.value
      ? (this.editForm.get(['lastModifiedDate'])!.value as Dayjs).format(DATE_TIME_FORMAT).toString()
      : null;

    const lastOrderDate: any = this.editForm.get(['lastOrderDate'])!.value
      ? (this.editForm.get(['lastOrderDate'])!.value as Dayjs).format(DATE_TIME_FORMAT).toString()
      : null;

    const createdDate: any = this.editForm.get(['createdDate'])!.value
      ? (this.editForm.get(['createdDate'])!.value as Dayjs).format(DATE_TIME_FORMAT).toString()
      : null;
    ('');

    (product.id = this.editForm.get(['id'])!.value),
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
      (product.lastModifiedDate = lastModifiedDate);

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
    this.updateForm(res);
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
