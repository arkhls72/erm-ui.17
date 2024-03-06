import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EhcClient } from '../ehc-client.model';
import { EhcClientService } from '../service/ehc-client.service';
import { EhcClientFormService, EhcClientFormGroup } from './ehc-client-form.service';

@Component({
  standalone: true,
  selector: 'jhi-ehc-client-update',
  templateUrl: './ehc-client-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EhcClientUpdateComponent implements OnInit {
  isSaving = false;
  ehcClient: EhcClient | null = null;

  editForm: EhcClientFormGroup = this.ehcClientFormService.createEhcClientFormGroup();

  constructor(
    protected ehcClientService: EhcClientService,
    protected ehcClientFormService: EhcClientFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ehcClient }) => {
      this.ehcClient = ehcClient;
      if (ehcClient) {
        this.updateForm(ehcClient);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ehcClient = this.ehcClientFormService.getEhcClient(this.editForm);
    if (ehcClient.id !== null) {
      this.subscribeToSaveResponse(this.ehcClientService.update(ehcClient));
    } else {
      this.subscribeToSaveResponse(this.ehcClientService.create(ehcClient));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<EhcClient>>): void {
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

  protected updateForm(ehcClient: EhcClient): void {
    this.ehcClient = ehcClient;
    this.ehcClientFormService.resetForm(this.editForm, ehcClient);
  }
}
