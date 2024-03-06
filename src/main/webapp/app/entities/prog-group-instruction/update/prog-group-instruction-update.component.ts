import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProgGroupInstruction } from '../prog-group-instruction.model';
import { ProgGroupInstructionService } from '../service/prog-group-instruction.service';
import { ProgGroupInstructionFormService, ProgGroupInstructionFormGroup } from './prog-group-instruction-form.service';

@Component({
  standalone: true,
  selector: 'jhi-prog-group-instruction-update',
  templateUrl: './prog-group-instruction-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProgGroupInstructionUpdateComponent implements OnInit {
  isSaving = false;
  progGroupInstruction: ProgGroupInstruction | null = null;

  editForm: ProgGroupInstructionFormGroup = this.progGroupInstructionFormService.createProgGroupInstructionFormGroup();

  constructor(
    protected progGroupInstructionService: ProgGroupInstructionService,
    protected progGroupInstructionFormService: ProgGroupInstructionFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ progGroupInstruction }) => {
      this.progGroupInstruction = progGroupInstruction;
      if (progGroupInstruction) {
        this.updateForm(progGroupInstruction);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const progGroupInstruction = this.progGroupInstructionFormService.getProgGroupInstruction(this.editForm);
    if (progGroupInstruction.id !== null) {
      this.subscribeToSaveResponse(this.progGroupInstructionService.update(progGroupInstruction));
    } else {
      this.subscribeToSaveResponse(this.progGroupInstructionService.create(progGroupInstruction));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProgGroupInstruction>>): void {
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

  protected updateForm(progGroupInstruction: ProgGroupInstruction): void {
    this.progGroupInstruction = progGroupInstruction;
    this.progGroupInstructionFormService.resetForm(this.editForm, progGroupInstruction);
  }
}
