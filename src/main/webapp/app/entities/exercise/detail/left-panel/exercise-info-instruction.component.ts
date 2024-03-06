import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { Instruction } from 'app/entities/instruction/instruction.model';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { InstructionService } from '../../../instruction/service/instruction.service';
import { DATE_TIME_FORMAT } from '../../../../config/input.constants';
import dayjs from 'dayjs/esm';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-exercise-info-instruction',
  templateUrl: './exercise-info-instruction.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class ExerciseInfoInstructionComponent implements OnInit {
  innerEditMode = false;
  lastModifiedDateDp: any;
  durations: string[] = ['Daily', 'Weekly', 'Monthly'];
  instruction!: Instruction | null;
  @Output()
  cancelEmiiter = new EventEmitter();

  @Input()
  exercise: Exercise | null = null;
  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    repeat: [],
    hold: [],
    complete: [],
    perform: [],
    note: [null, [Validators.maxLength(350)]],
    durationNumber: [],
    duration: [],
    exerciseId: [],
    lastModifiedDate: [],
  });

  constructor(
    protected instructionService: InstructionService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public ngIf: NgIf,
    public ngFor: NgFor<any>,
  ) {}

  ngOnInit(): void {
    const exerciseId = this.exercise ? this.exercise.id : undefined;
    if (exerciseId) {
      this.instructionService.findByExerciseId(exerciseId).subscribe(res => {
        const instruction = res.body;
        if (instruction) {
          this.instruction = instruction;
          this.updateForm(this.instruction);
        }
      });
    }
  }

  updateForm(input: any): void {
    if (this.exercise && this.exercise.id) {
      input.exerciseId = this.exercise.id;
    }
    input.exerciseId;
    if (input) {
      this.editForm.patchValue({
        id: input.id,
        name: input.name,
        repeat: input.repeat,
        hold: input.hold,
        complete: input.complete,
        perform: input.perform,
        note: input.note,
        durationNumber: input.durationNumber,
        duration: input.duration,
        exerciseId: input.exerciseId,
        lastModifiedDate: input.lastModifiedDate ? input.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
      });
    }
  }
  previousState(): void {
    window.history.back();
  }

  saveDefault(): void {
    const instruction = this.createFromForm();
    instruction.exerciseId = this.exercise ? this.exercise.id : null;
    if (instruction.id) {
      this.subscribeToSaveResponse(this.instructionService.updateDefault(instruction));
    } else {
      this.subscribeToSaveResponse(this.instructionService.createDefault(instruction));
    }
  }

  private createFromForm(): Instruction {
    const instruction = {} as Instruction;

    (instruction.id = this.editForm.get(['id'])!.value),
      (instruction.name = this.editForm.get(['name'])!.value),
      (instruction.repeat = this.editForm.get(['repeat'])!.value),
      (instruction.hold = this.editForm.get(['hold'])!.value),
      (instruction.complete = this.editForm.get(['complete'])!.value),
      (instruction.perform = this.editForm.get(['perform'])!.value),
      (instruction.note = this.editForm.get(['note'])!.value),
      (instruction.durationNumber = this.editForm.get(['durationNumber'])!.value),
      (instruction.duration = this.editForm.get(['duration'])!.value),
      (instruction.exerciseId = this.exercise && this.exercise.id !== null ? this.exercise.id : null),
      (instruction.lastModifiedDate = this.editForm.get(['lastModifiedDate'])!.value
        ? dayjs(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
        : undefined);

    return instruction;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Instruction>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body));
  }

  protected onSaveSuccess(instruction: Instruction | null): void {
    this.instruction = instruction;
    this.updateForm(this.instruction);
  }

  cancelInstruction() {
    this.cancelEmiiter.emit();
  }

  //  changeDuration(duration: Event) {
  changeDuration(duration: any) {
    this.editForm.patchValue({
      duration: duration.currentTarget,
    });
  }
  defaultDuration(duration: string) {
    const formDuration = this.editForm.get(['duration'])!.value;
    if (formDuration === duration) {
      return true;
    }
    return false;
  }
  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.innerEditMode = true;
      if (!this.instruction || !this.instruction.id) {
        this.initEmptyInstruction();
      }
      return true;
    } else {
      this.innerEditMode = false;
      if (!this.instruction || !this.instruction.id) {
        this.clearInstructionForm();
      }
      return false;
    }
    this.innerEditMode = false;
    this.clearInstructionForm();
    return false;
  }

  initEmptyInstruction() {
    const target = {} as Instruction;
    target.duration = 'Daily';
    target.exerciseId = this.exercise!.id;
    target.complete = 1;
    target.hold = 1;
    target.perform = 1;
    target.repeat = 1;
    target.durationNumber = 1;
    this.updateForm(target);
  }

  clearInstructionForm() {
    const target = {} as Instruction;
    target.duration = undefined;
    target.exerciseId = undefined;
    target.complete = undefined;
    target.hold = undefined;
    target.perform = undefined;
    target.repeat = undefined;
    target.durationNumber = undefined;
    this.updateForm(target);
  }
}
