import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Exercise } from '../exercise.model';
import { ExerciseService } from '../service/exercise.service';
import { ExerciseFormService, ExerciseFormGroup } from './exercise-form.service';

@Component({
  standalone: true,
  selector: 'jhi-exercise-update',
  templateUrl: './exercise-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ExerciseUpdateComponent implements OnInit {
  isSaving = false;
  exercise: Exercise | null = null;

  editForm: ExerciseFormGroup = this.exerciseFormService.createExerciseFormGroup();

  constructor(
    protected exerciseService: ExerciseService,
    protected exerciseFormService: ExerciseFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exercise }) => {
      this.exercise = exercise;
      if (exercise) {
        this.updateForm(exercise);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const exercise = <Exercise>this.exerciseFormService.getExercise(this.editForm);
    if (exercise.id !== null) {
      this.subscribeToSaveResponse(this.exerciseService.update(exercise));
    } else {
      this.subscribeToSaveResponse(this.exerciseService.create(exercise));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Exercise>>): void {
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

  protected updateForm(exercise: Exercise): void {
    this.exercise = exercise;
    this.exerciseFormService.resetForm(this.editForm, exercise);
  }
}
