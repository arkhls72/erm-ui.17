import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductSpecification } from 'app/entities/product-specification/product-specification.model';
import { Product } from 'app/entities/product/product.model';
import { ProductSpecificationService } from '../../../../product-specification/service/product-specification.service';
import { DATE_TIME_FORMAT } from '../../../../../config/input.constants';

@Component({
  selector: 'bc-supplier-product-spec',
  templateUrl: './supplier-product-spec.component.html',
})
export class SupplierProductSpecComponent implements OnInit {
  isSaving = false;
  isUpdating = false;
  productSpecification?: any = ProductSpecification;
  @Input()
  product!: Product;
  editForm = this.fb.group({
    id: [],
    make: [null, [Validators.maxLength(25)]],
    modelNumber: [null, [Validators.maxLength(25)]],
    serialNumber: [null, [Validators.maxLength(25)]],
    barcodeMediaId: [],
    mediaId: [],
    productId: [],
    lastModifiedBy: [],
    lastModifiedDate: [],
  });

  constructor(
    protected productSpecificationService: ProductSpecificationService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    const product: any = this.product;
    this.productSpecificationService.findByProduct(product.id).subscribe(res => {
      const spec: any = res.body;
      this.productSpecification = spec;
      if (spec !== undefined && spec !== null) {
        this.isUpdating = true;
        this.updateForm(this.productSpecification);
      }
    });
  }

  updateForm(productSpecification: any): void {
    productSpecification.productId = this.product.id;
    this.editForm.patchValue({
      id: productSpecification.id,
      make: productSpecification.make,
      modelNumber: productSpecification.modelNumber,
      serialNumber: productSpecification.serialNumber,
      barcodeMediaId: productSpecification.barcodeMediaId,
      productId: productSpecification.productId,
      mediaId: productSpecification.mediaId,
      lastModifiedBy: productSpecification.lastModifiedBy,
      lastModifiedDate: productSpecification.lastModifiedDate ? productSpecification.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productSpecification = this.createFromForm();
    if (productSpecification.id !== undefined && productSpecification.id !== null) {
      this.subscribeToSaveResponse(this.productSpecificationService.update(productSpecification));
    } else {
      productSpecification.productId = this.product.id;
      this.subscribeToSaveResponse(this.productSpecificationService.create(productSpecification));
    }
  }

  private createFromForm(): ProductSpecification {
    const ps = {} as ProductSpecification;

    (ps.id = this.editForm.get(['id'])!.value),
      (ps.make = this.editForm.get(['make'])!.value),
      (ps.modelNumber = this.editForm.get(['modelNumber'])!.value),
      (ps.serialNumber = this.editForm.get(['serialNumber'])!.value),
      (ps.barcodeMediaId = this.editForm.get(['barcodeMediaId'])!.value),
      (ps.mediaId = this.editForm.get(['mediaId?'])!.value),
      (ps.productId = this.editForm.get(['productId'])!.value),
      (ps.lastModifiedBy = this.editForm.get(['lastModifiedBy'])!.value),
      (ps.lastModifiedDate = this.editForm.get(['lastModifiedDate'])!.value);

    return ps;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProductSpecification>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(res: any): void {
    this.isSaving = false;
    this.productSpecification = res.body;
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
