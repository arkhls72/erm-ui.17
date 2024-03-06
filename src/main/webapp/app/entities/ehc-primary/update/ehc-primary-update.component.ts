import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EhcPrimary } from '../ehc-primary.model';
import { EhcPrimaryService } from '../service/ehc-primary.service';
import { EhcPrimaryFormService, EhcPrimaryFormGroup } from './ehc-primary-form.service';

@Component({
  standalone: true,
  selector: 'jhi-ehc-primary-update',
  templateUrl: './ehc-primary-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EhcPrimaryUpdateComponent implements OnInit {
  isSaving = false;
  ehcPrimary: EhcPrimary | null = null;

  editForm: EhcPrimaryFormGroup = this.ehcPrimaryFormService.createEhcPrimaryFormGroup();

  constructor(
    protected ehcPrimaryService: EhcPrimaryService,
    protected ehcPrimaryFormService: EhcPrimaryFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ehcPrimary }) => {
      this.ehcPrimary = ehcPrimary;
      if (ehcPrimary) {
        this.updateForm(ehcPrimary);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ehcPrimary = this.ehcPrimaryFormService.getEhcPrimary(this.editForm);
    if (ehcPrimary.id !== null) {
      this.subscribeToSaveResponse(this.ehcPrimaryService.update(ehcPrimary));
    } else {
      this.subscribeToSaveResponse(this.ehcPrimaryService.create(ehcPrimary));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<EhcPrimary>>): void {
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

  protected updateForm(ehcPrimary: EhcPrimary): void {
    this.ehcPrimary = ehcPrimary;
    this.ehcPrimaryFormService.resetForm(this.editForm, ehcPrimary);
  }
}
