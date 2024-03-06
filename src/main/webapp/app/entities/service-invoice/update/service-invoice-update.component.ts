import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ServiceInvoice } from '../service-invoice.model';
import { ServiceInvoiceService } from '../service/service-invoice.service';
import { ServiceInvoiceFormService, ServiceInvoiceFormGroup } from './service-invoice-form.service';

@Component({
  standalone: true,
  selector: 'jhi-service-invoice-update',
  templateUrl: './service-invoice-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ServiceInvoiceUpdateComponent implements OnInit {
  isSaving = false;
  serviceInvoice: ServiceInvoice | null = null;

  editForm: ServiceInvoiceFormGroup = this.serviceInvoiceFormService.createServiceInvoiceFormGroup();

  constructor(
    protected serviceInvoiceService: ServiceInvoiceService,
    protected serviceInvoiceFormService: ServiceInvoiceFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceInvoice }) => {
      this.serviceInvoice = serviceInvoice;
      if (serviceInvoice) {
        this.updateForm(serviceInvoice);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const serviceInvoice = this.serviceInvoiceFormService.getServiceInvoice(this.editForm);
    if (serviceInvoice.id !== null) {
      this.subscribeToSaveResponse(this.serviceInvoiceService.update(serviceInvoice));
    } else {
      this.subscribeToSaveResponse(this.serviceInvoiceService.create(serviceInvoice));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ServiceInvoice>>): void {
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

  protected updateForm(serviceInvoice: ServiceInvoice): void {
    this.serviceInvoice = serviceInvoice;
    this.serviceInvoiceFormService.resetForm(this.editForm, serviceInvoice);
  }
}
