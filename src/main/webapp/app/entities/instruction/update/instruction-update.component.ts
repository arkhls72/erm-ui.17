import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Instruction } from '../instruction.model';
import { InstructionService } from '../service/instruction.service';
import { InstructionFormService, InstructionFormGroup } from './instruction-form.service';

@Component({
  standalone: true,
  selector: 'jhi-instruction-update',
  templateUrl: './instruction-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InstructionUpdateComponent implements OnInit {
  isSaving = false;
  instruction: Instruction | null = null;

  editForm: InstructionFormGroup = this.instructionFormService.createInstructionFormGroup();

  constructor(
    protected instructionService: InstructionService,
    protected instructionFormService: InstructionFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ instruction }) => {
      this.instruction = instruction;
      if (instruction) {
        this.updateForm(instruction);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const instruction = <Instruction>this.instructionFormService.getInstruction(this.editForm);
    if (instruction.id !== null) {
      this.subscribeToSaveResponse(this.instructionService.update(instruction));
    } else {
      this.subscribeToSaveResponse(this.instructionService.create(instruction));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Instruction>>): void {
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

  protected updateForm(instruction: Instruction): void {
    this.instruction = instruction;
    this.instructionFormService.resetForm(this.editForm, instruction);
  }
}
