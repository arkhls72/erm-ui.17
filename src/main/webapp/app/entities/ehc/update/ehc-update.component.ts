import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ehc } from '../ehc.model';
import { EhcService } from '../service/ehc.service';
import { EhcFormService, EhcFormGroup } from './ehc-form.service';

@Component({
  standalone: true,
  selector: 'jhi-ehc-update',
  templateUrl: './ehc-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EhcUpdateComponent implements OnInit {
  isSaving = false;
  ehc: Ehc | null = null;

  editForm: EhcFormGroup = this.ehcFormService.createEhcFormGroup();

  constructor(
    protected ehcService: EhcService,
    protected ehcFormService: EhcFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ehc }) => {
      this.ehc = ehc;
      if (ehc) {
        this.updateForm(ehc);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ehc = this.ehcFormService.getEhc(this.editForm);
    if (ehc.id !== null) {
      this.subscribeToSaveResponse(this.ehcService.update(ehc));
    } else {
      this.subscribeToSaveResponse(this.ehcService.create(ehc));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Ehc>>): void {
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

  protected updateForm(ehc: Ehc): void {
    this.ehc = ehc;
    this.ehcFormService.resetForm(this.editForm, ehc);
  }
}
