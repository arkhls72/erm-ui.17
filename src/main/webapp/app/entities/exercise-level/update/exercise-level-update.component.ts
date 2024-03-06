import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExerciseLevel } from '../exercise-level.model';
import { ExerciseLevelService } from '../service/exercise-level.service';
import { ExerciseLevelFormService, ExerciseLevelFormGroup } from './exercise-level-form.service';

@Component({
  standalone: true,
  selector: 'jhi-exercise-level-update',
  templateUrl: './exercise-level-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ExerciseLevelUpdateComponent implements OnInit {
  isSaving = false;
  exerciseLevel: ExerciseLevel | null = null;

  editForm: ExerciseLevelFormGroup = this.exerciseLevelFormService.createExerciseLevelFormGroup();

  constructor(
    protected exerciseLevelService: ExerciseLevelService,
    protected exerciseLevelFormService: ExerciseLevelFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exerciseLevel }) => {
      this.exerciseLevel = exerciseLevel;
      if (exerciseLevel) {
        this.updateForm(exerciseLevel);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const exerciseLevel = this.exerciseLevelFormService.getExerciseLevel(this.editForm);
    if (exerciseLevel.id !== null) {
      this.subscribeToSaveResponse(this.exerciseLevelService.update(exerciseLevel));
    } else {
      this.subscribeToSaveResponse(this.exerciseLevelService.create(exerciseLevel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ExerciseLevel>>): void {
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

  protected updateForm(exerciseLevel: ExerciseLevel): void {
    this.exerciseLevel = exerciseLevel;
    this.exerciseLevelFormService.resetForm(this.editForm, exerciseLevel);
  }
}
