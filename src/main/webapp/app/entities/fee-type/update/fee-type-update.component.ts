import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FeeType } from '../fee-type.model';
import { FeeTypeService } from '../service/fee-type.service';
import { FeeTypeFormService, FeeTypeFormGroup } from './fee-type-form.service';

@Component({
  standalone: true,
  selector: 'jhi-fee-type-update',
  templateUrl: './fee-type-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class FeeTypeUpdateComponent implements OnInit {
  isSaving = false;
  feeType: FeeType | null = null;

  editForm: FeeTypeFormGroup = this.feeTypeFormService.createFeeTypeFormGroup();

  constructor(
    protected feeTypeService: FeeTypeService,
    protected feeTypeFormService: FeeTypeFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ feeType }) => {
      this.feeType = feeType;
      if (feeType) {
        this.updateForm(feeType);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const feeType = this.feeTypeFormService.getFeeType(this.editForm);
    if (feeType.id !== null) {
      this.subscribeToSaveResponse(this.feeTypeService.update(feeType));
    } else {
      this.subscribeToSaveResponse(this.feeTypeService.create(feeType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<FeeType>>): void {
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

  protected updateForm(feeType: FeeType): void {
    this.feeType = feeType;
    this.feeTypeFormService.resetForm(this.editForm, feeType);
  }
}
