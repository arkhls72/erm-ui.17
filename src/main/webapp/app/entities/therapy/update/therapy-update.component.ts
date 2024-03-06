import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Therapy } from '../therapy.model';
import { TherapyService } from '../service/therapy.service';
import { TherapyFormService, TherapyFormGroup } from './therapy-form.service';

@Component({
  standalone: true,
  selector: 'jhi-therapy-update',
  templateUrl: './therapy-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TherapyUpdateComponent implements OnInit {
  isSaving = false;
  therapy: Therapy | null = null;

  editForm: TherapyFormGroup = this.therapyFormService.createTherapyFormGroup();

  constructor(
    protected therapyService: TherapyService,
    protected therapyFormService: TherapyFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ therapy }) => {
      this.therapy = therapy;
      if (therapy) {
        this.updateForm(therapy);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const therapy = this.therapyFormService.getTherapy(this.editForm);
    if (therapy.id !== null) {
      this.subscribeToSaveResponse(this.therapyService.update(therapy));
    } else {
      this.subscribeToSaveResponse(this.therapyService.create(therapy));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Therapy>>): void {
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

  protected updateForm(therapy: Therapy): void {
    this.therapy = therapy;
    this.therapyFormService.resetForm(this.editForm, therapy);
  }
}
