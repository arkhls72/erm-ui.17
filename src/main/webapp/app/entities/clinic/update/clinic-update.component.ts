import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Clinic } from '../clinic.model';
import { ClinicService } from '../service/clinic.service';
import { ClinicFormService, ClinicFormGroup } from './clinic-form.service';

@Component({
  standalone: true,
  selector: 'jhi-clinic-update',
  templateUrl: './clinic-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ClinicUpdateComponent implements OnInit {
  isSaving = false;
  clinic: Clinic | null = null;

  editForm: ClinicFormGroup = this.clinicFormService.createClinicFormGroup();

  constructor(
    protected clinicService: ClinicService,
    protected clinicFormService: ClinicFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clinic }) => {
      this.clinic = clinic;
      if (clinic) {
        this.updateForm(clinic);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const clinic = this.clinicFormService.getClinic(this.editForm);
    if (clinic.id !== null) {
      this.subscribeToSaveResponse(this.clinicService.update(clinic));
    } else {
      this.subscribeToSaveResponse(this.clinicService.create(clinic));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Clinic>>): void {
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

  protected updateForm(clinic: Clinic): void {
    this.clinic = clinic;
    this.clinicFormService.resetForm(this.editForm, clinic);
  }
}
