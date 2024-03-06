import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoverageFormService, CoverageFormGroup } from './coverage-form.service';
import { Coverage } from '../coverage.model';
import { CoverageService } from '../service/coverage.service';

@Component({
  standalone: true,
  selector: 'jhi-coverage-update',
  templateUrl: './coverage-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CoverageUpdateComponent implements OnInit {
  isSaving = false;
  coverage: Coverage | null = null;

  editForm: CoverageFormGroup = this.coverageFormService.createCoverageFormGroup();

  constructor(
    protected coverageService: CoverageService,
    protected coverageFormService: CoverageFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ coverage }) => {
      this.coverage = coverage;
      if (coverage) {
        this.updateForm(coverage);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const coverage = this.coverageFormService.getCoverage(this.editForm);
    if (coverage.id !== null) {
      this.subscribeToSaveResponse(this.coverageService.update(coverage));
    } else {
      this.subscribeToSaveResponse(this.coverageService.create(coverage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Coverage>>): void {
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

  protected updateForm(coverage: Coverage): void {
    this.coverage = coverage;
    this.coverageFormService.resetForm(this.editForm, coverage);
  }
}
