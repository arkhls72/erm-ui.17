import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonServiceCode } from '../common-service-code.model';
import { CommonServiceCodeService } from '../service/common-service-code.service';
import { CommonServiceCodeFormService, CommonServiceCodeFormGroup } from './common-service-code-form.service';
import SharedModule from '../../../shared/shared.module';

@Component({
  standalone: true,
  selector: 'jhi-common-service-code-update',
  templateUrl: './common-service-code-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CommonServiceCodeUpdateComponent implements OnInit {
  isSaving = false;
  commonServiceCode: CommonServiceCode | null = null;

  editForm: CommonServiceCodeFormGroup = this.commonServiceCodeFormService.createCommonServiceCodeFormGroup();

  constructor(
    protected commonServiceCodeService: CommonServiceCodeService,
    protected commonServiceCodeFormService: CommonServiceCodeFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commonServiceCode }) => {
      this.commonServiceCode = commonServiceCode;
      if (commonServiceCode) {
        this.updateForm(commonServiceCode);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const commonServiceCode = this.commonServiceCodeFormService.getCommonServiceCode(this.editForm);
    if (commonServiceCode.id !== null) {
      this.subscribeToSaveResponse(this.commonServiceCodeService.update(commonServiceCode));
    } else {
      this.subscribeToSaveResponse(this.commonServiceCodeService.create(commonServiceCode));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<CommonServiceCode>>): void {
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

  protected updateForm(commonServiceCode: CommonServiceCode): void {
    this.commonServiceCode = commonServiceCode;
    this.commonServiceCodeFormService.resetForm(this.editForm, commonServiceCode);
  }
}
