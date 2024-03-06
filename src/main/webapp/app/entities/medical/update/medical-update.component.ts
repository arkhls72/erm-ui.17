import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Medical } from '../medical.model';
import { MedicalService } from '../service/medical.service';
import { MedicalFormService, MedicalFormGroup } from './medical-form.service';

@Component({
  standalone: true,
  selector: 'jhi-medical-update',
  templateUrl: './medical-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MedicalUpdateComponent implements OnInit {
  isSaving = false;
  medical: Medical | null = null;

  editForm: MedicalFormGroup = this.medicalFormService.createMedicalFormGroup();

  constructor(
    protected medicalService: MedicalService,
    protected medicalFormService: MedicalFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medical }) => {
      this.medical = medical;
      if (medical) {
        this.updateForm(medical);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const medical = this.medicalFormService.getMedical(this.editForm);
    if (medical.id !== null) {
      this.subscribeToSaveResponse(this.medicalService.update(medical));
    } else {
      this.subscribeToSaveResponse(this.medicalService.create(medical));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Medical>>): void {
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

  protected updateForm(medical: Medical): void {
    this.medical = medical;
    this.medicalFormService.resetForm(this.editForm, medical);
  }
}
