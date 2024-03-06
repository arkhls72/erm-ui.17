import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExerGroupDetaill } from '../exer-group-detaill.model';
import { ExerGroupDetaillService } from '../service/exer-group-detaill.service';
import { ExerGroupDetaillFormService, ExerGroupDetaillFormGroup } from './exer-group-detaill-form.service';

@Component({
  standalone: true,
  selector: 'jhi-exer-group-detaill-update',
  templateUrl: './exer-group-detaill-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ExerGroupDetaillUpdateComponent implements OnInit {
  isSaving = false;
  exerGroupDetaill: ExerGroupDetaill | null = null;

  editForm: ExerGroupDetaillFormGroup = this.exerGroupDetaillFormService.createExerGroupDetaillFormGroup();

  constructor(
    protected exerGroupDetaillService: ExerGroupDetaillService,
    protected exerGroupDetaillFormService: ExerGroupDetaillFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exerGroupDetaill }) => {
      this.exerGroupDetaill = exerGroupDetaill;
      if (exerGroupDetaill) {
        this.updateForm(exerGroupDetaill);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const exerGroupDetaill = this.exerGroupDetaillFormService.getExerGroupDetaill(this.editForm);
    if (exerGroupDetaill.id !== null) {
      this.subscribeToSaveResponse(this.exerGroupDetaillService.update(exerGroupDetaill));
    } else {
      this.subscribeToSaveResponse(this.exerGroupDetaillService.create(exerGroupDetaill));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ExerGroupDetaill>>): void {
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

  protected updateForm(exerGroupDetaill: ExerGroupDetaill): void {
    this.exerGroupDetaill = exerGroupDetaill;
    this.exerGroupDetaillFormService.resetForm(this.editForm, exerGroupDetaill);
  }
}
