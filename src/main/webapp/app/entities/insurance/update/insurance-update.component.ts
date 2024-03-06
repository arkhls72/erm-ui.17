import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Insurance } from '../insurance.model';
import { InsuranceService } from '../service/insurance.service';
import { InsuranceFormService, InsuranceFormGroup } from './insurance-form.service';

@Component({
  standalone: true,
  selector: 'jhi-insurance-update',
  templateUrl: './insurance-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InsuranceUpdateComponent implements OnInit {
  isSaving = false;
  insurance: Insurance | null = null;

  editForm: InsuranceFormGroup = this.insuranceFormService.createInsuranceFormGroup();

  constructor(
    protected insuranceService: InsuranceService,
    protected insuranceFormService: InsuranceFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ insurance }) => {
      this.insurance = insurance;
      if (insurance) {
        this.updateForm(insurance);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const insurance = this.insuranceFormService.getInsurance(this.editForm);
    if (insurance.id !== null) {
      this.subscribeToSaveResponse(this.insuranceService.update(insurance));
    } else {
      this.subscribeToSaveResponse(this.insuranceService.create(insurance));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Insurance>>): void {
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

  protected updateForm(insurance: Insurance): void {
    this.insurance = insurance;
    this.insuranceFormService.resetForm(this.editForm, insurance);
  }
}
