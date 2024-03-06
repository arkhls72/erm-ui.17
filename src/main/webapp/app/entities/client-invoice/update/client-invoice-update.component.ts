import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClientInvoice } from '../client-invoice.model';
import { ClientInvoiceService } from '../service/client-invoice.service';
import { ClientInvoiceFormService, ClientInvoiceFormGroup } from './client-invoice-form.service';

@Component({
  standalone: true,
  selector: 'jhi-client-invoice-update',
  templateUrl: './client-invoice-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ClientInvoiceUpdateComponent implements OnInit {
  isSaving = false;
  clientInvoice: ClientInvoice | null = null;

  editForm: ClientInvoiceFormGroup = this.clientInvoiceFormService.createClientInvoiceFormGroup();

  constructor(
    protected clientInvoiceService: ClientInvoiceService,
    protected clientInvoiceFormService: ClientInvoiceFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clientInvoice }) => {
      this.clientInvoice = clientInvoice;
      if (clientInvoice) {
        this.updateForm(clientInvoice);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const clientInvoice = this.clientInvoiceFormService.getClientInvoice(this.editForm);
    if (clientInvoice.id !== null) {
      this.subscribeToSaveResponse(this.clientInvoiceService.update(clientInvoice));
    } else {
      this.subscribeToSaveResponse(this.clientInvoiceService.create(clientInvoice));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ClientInvoice>>): void {
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

  protected updateForm(clientInvoice: ClientInvoice): void {
    this.clientInvoice = clientInvoice;
    this.clientInvoiceFormService.resetForm(this.editForm, clientInvoice);
  }
}
