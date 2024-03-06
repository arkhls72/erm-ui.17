import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Muscle } from '../muscle.model';
import { MuscleService } from '../service/muscle.service';
import { MuscleFormService, MuscleFormGroup } from './muscle-form.service';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';

@Component({
  standalone: true,
  selector: 'jhi-muscle-update',
  templateUrl: './muscle-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, AlertErrorComponent],
})
export class MuscleUpdateComponent implements OnInit {
  isSaving = false;
  muscle: Muscle | null = null;

  editForm: MuscleFormGroup = this.muscleFormService.createMuscleFormGroup();

  constructor(
    protected muscleService: MuscleService,
    protected muscleFormService: MuscleFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ muscle }) => {
      this.muscle = muscle;
      if (muscle) {
        this.updateForm(muscle);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const muscle = this.muscleFormService.getMuscle(this.editForm);
    if (muscle.id !== null) {
      this.subscribeToSaveResponse(this.muscleService.update(muscle));
    } else {
      this.subscribeToSaveResponse(this.muscleService.create(muscle));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Muscle>>): void {
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

  protected updateForm(muscle: Muscle): void {
    this.muscle = muscle;
    this.muscleFormService.resetForm(this.editForm, muscle);
  }
}
