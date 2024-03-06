import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProgExerciseInstruction } from '../prog-exercise-instruction.model';
import { ProgExerciseInstructionService } from '../service/prog-exercise-instruction.service';
import { ProgExerciseInstructionFormService, ProgExerciseInstructionFormGroup } from './prog-exercise-instruction-form.service';

@Component({
  standalone: true,
  selector: 'jhi-prog-exercise-instruction-update',
  templateUrl: './prog-exercise-instruction-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProgExerciseInstructionUpdateComponent implements OnInit {
  isSaving = false;
  progExerciseInstruction: ProgExerciseInstruction | null = null;

  editForm: ProgExerciseInstructionFormGroup = this.progExerciseInstructionFormService.createProgExerciseInstructionFormGroup();

  constructor(
    protected progExerciseInstructionService: ProgExerciseInstructionService,
    protected progExerciseInstructionFormService: ProgExerciseInstructionFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ progExerciseInstruction }) => {
      this.progExerciseInstruction = progExerciseInstruction;
      if (progExerciseInstruction) {
        this.updateForm(progExerciseInstruction);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const progExerciseInstruction = this.progExerciseInstructionFormService.getProgExerciseInstruction(this.editForm);
    if (progExerciseInstruction.id !== null) {
      this.subscribeToSaveResponse(this.progExerciseInstructionService.update(progExerciseInstruction));
    } else {
      this.subscribeToSaveResponse(this.progExerciseInstructionService.create(progExerciseInstruction));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProgExerciseInstruction>>): void {
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

  protected updateForm(progExerciseInstruction: ProgExerciseInstruction): void {
    this.progExerciseInstruction = progExerciseInstruction;
    this.progExerciseInstructionFormService.resetForm(this.editForm, progExerciseInstruction);
  }
}
