import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductOrder } from '../product-order.model';
import { ProductOrderService } from '../service/product-order.service';
import { ProductOrderFormService, ProductOrderFormGroup } from './product-order-form.service';

@Component({
  standalone: true,
  selector: 'jhi-product-order-update',
  templateUrl: './product-order-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProductOrderUpdateComponent implements OnInit {
  isSaving = false;
  productOrder: ProductOrder | null = null;

  editForm: ProductOrderFormGroup = this.productOrderFormService.createProductOrderFormGroup();

  constructor(
    protected productOrderService: ProductOrderService,
    protected productOrderFormService: ProductOrderFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productOrder }) => {
      this.productOrder = productOrder;
      if (productOrder) {
        this.updateForm(productOrder);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productOrder = <ProductOrder>this.productOrderFormService.getProductOrder(this.editForm);
    if (productOrder.id !== null) {
      this.subscribeToSaveResponse(this.productOrderService.update(productOrder));
    } else {
      this.subscribeToSaveResponse(this.productOrderService.create(productOrder));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProductOrder>>): void {
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

  protected updateForm(productOrder: ProductOrder): void {
    this.productOrder = productOrder;
    this.productOrderFormService.resetForm(this.editForm, productOrder);
  }
}
