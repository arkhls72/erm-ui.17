import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductInvoice } from '../product-invoice.model';
import { ProductInvoiceService } from '../service/product-invoice.service';
import { ProductInvoiceFormService, ProductInvoiceFormGroup } from './product-invoice-form.service';

@Component({
  standalone: true,
  selector: 'jhi-product-invoice-update',
  templateUrl: './product-invoice-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProductInvoiceUpdateComponent implements OnInit {
  isSaving = false;
  productInvoice: ProductInvoice | null = null;

  editForm: ProductInvoiceFormGroup = this.productInvoiceFormService.createProductInvoiceFormGroup();

  constructor(
    protected productInvoiceService: ProductInvoiceService,
    protected productInvoiceFormService: ProductInvoiceFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productInvoice }) => {
      this.productInvoice = productInvoice;
      if (productInvoice) {
        this.updateForm(productInvoice);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productInvoice = this.productInvoiceFormService.getProductInvoice(this.editForm);
    if (productInvoice.id !== null) {
      this.subscribeToSaveResponse(this.productInvoiceService.update(productInvoice));
    } else {
      this.subscribeToSaveResponse(this.productInvoiceService.create(productInvoice));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProductInvoice>>): void {
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

  protected updateForm(productInvoice: ProductInvoice): void {
    this.productInvoice = productInvoice;
    this.productInvoiceFormService.resetForm(this.editForm, productInvoice);
  }
}
