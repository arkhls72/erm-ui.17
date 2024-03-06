import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExerciseTool } from '../exercise-tool.model';
import { ExerciseToolService } from '../service/exercise-tool.service';
import { ExerciseToolFormService, ExerciseToolFormGroup } from './exercise-tool-form.service';

@Component({
  standalone: true,
  selector: 'jhi-exercise-tool-update',
  templateUrl: './exercise-tool-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ExerciseToolUpdateComponent implements OnInit {
  isSaving = false;
  exerciseTool: ExerciseTool | null = null;

  editForm: ExerciseToolFormGroup = this.exerciseToolFormService.createExerciseToolFormGroup();

  constructor(
    protected exerciseToolService: ExerciseToolService,
    protected exerciseToolFormService: ExerciseToolFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exerciseTool }) => {
      this.exerciseTool = exerciseTool;
      if (exerciseTool) {
        this.updateForm(exerciseTool);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const exerciseTool = this.exerciseToolFormService.getExerciseTool(this.editForm);
    if (exerciseTool.id !== null) {
      this.subscribeToSaveResponse(this.exerciseToolService.update(exerciseTool));
    } else {
      this.subscribeToSaveResponse(this.exerciseToolService.create(exerciseTool));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ExerciseTool>>): void {
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

  protected updateForm(exerciseTool: ExerciseTool): void {
    this.exerciseTool = exerciseTool;
    this.exerciseToolFormService.resetForm(this.editForm, exerciseTool);
  }
}
