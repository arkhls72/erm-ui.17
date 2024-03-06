import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductSpecification } from '../product-specification.model';
import { ProductSpecificationService } from '../service/product-specification.service';
import { ProductSpecificationFormService, ProductSpecificationFormGroup } from './product-specification-form.service';

@Component({
  standalone: true,
  selector: 'jhi-product-specification-update',
  templateUrl: './product-specification-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProductSpecificationUpdateComponent implements OnInit {
  isSaving = false;
  productSpecification: ProductSpecification | null = null;

  editForm: ProductSpecificationFormGroup = this.productSpecificationFormService.createProductSpecificationFormGroup();

  constructor(
    protected productSpecificationService: ProductSpecificationService,
    protected productSpecificationFormService: ProductSpecificationFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productSpecification }) => {
      this.productSpecification = productSpecification;
      if (productSpecification) {
        this.updateForm(productSpecification);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productSpecification = <ProductSpecification>this.productSpecificationFormService.getProductSpecification(this.editForm);
    if (productSpecification.id !== null) {
      this.subscribeToSaveResponse(this.productSpecificationService.update(productSpecification));
    } else {
      this.subscribeToSaveResponse(this.productSpecificationService.create(productSpecification));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProductSpecification>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(productSpecification: ProductSpecification): void {
    this.productSpecification = productSpecification;
    this.productSpecificationFormService.resetForm(this.editForm, productSpecification);
  }
}
