import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { Instruction } from 'app/entities/instruction/instruction.model';
import { ProgGroupInstruction } from 'app/entities/prog-group-instruction/prog-group-instruction.model';
import { HttpResponse } from '@angular/common/http';
import { Prog } from 'app/entities/prog/prog.model';
import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { LocalStorageTree } from 'app/entities/local-share/cache/local-storage.tree';
import { InstructionService } from '../../../instruction/service/instruction.service';
import { ProgGroupInstructionService } from '../../../prog-group-instruction/service/prog-group-instruction.service';
import { DATE_TIME_FORMAT } from '../../../../config/input.constants';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-program-instruction-edit',
  templateUrl: './program-instruction-edit.component.html',
  imports: [ReactiveFormsModule, NgIf],
})
export class ProgramInstructionEditComponent implements OnInit {
  editMode = false;
  addMode = false;
  durations: string[] = ['Daily', 'Weekly', 'Monthly'];

  selectedInstruction!: Instruction | null;

  @Input()
  selectedProgGroupInstruction!: ProgGroupInstruction;

  @Input()
  selectedProg!: Prog;

  @Input()
  selectedExerGroup!: ExerGroup;

  @Input()
  selectedExercise!: Exercise;

  @Output()
  cancelInstructionEmitter = new EventEmitter();

  @Output()
  deleteInstructionEmitter = new EventEmitter<Instruction>();

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    repeat: [null, [Validators.required]],
    hold: [null, [Validators.required]],
    complete: [null, [Validators.required]],
    perform: [null, [Validators.required]],
    note: [null, [Validators.maxLength(350)]],
    durationNumber: [null, [Validators.required]],
    duration: [null, [Validators.required]],
    exerciseId: [],
    lastModifiedDate: [],
  });

  constructor(
    protected instructionService: InstructionService,
    protected progGroupInstructionService: ProgGroupInstructionService,
    protected activatedRoute: ActivatedRoute,
    protected cacheTree: LocalStorageTree,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    if (this.selectedProgGroupInstruction && this.selectedProgGroupInstruction.instruction) {
      this.selectedInstruction = this.selectedProgGroupInstruction.instruction;
      this.updateForm(this.selectedInstruction);
    }
  }

  // no exerciseId or exercise being sent to instruction table due to unique constraint
  updateForm(instruction: any): void {
    if (instruction) {
      this.editForm.patchValue({
        id: instruction.id,
        name: instruction.name,
        repeat: instruction.repeat,
        hold: instruction.hold,
        complete: instruction.complete,
        perform: instruction.perform,
        note: instruction.note,
        durationNumber: instruction.durationNumber,
        duration: instruction.duration,
        lastModifiedDate: instruction.lastModifiedDate ? instruction.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      });
    }
  }
  previousState(): void {
    window.history.back();
  }
  //
  save(): void {
    const target = this.createInstructionForm();
    if (target.id) {
      this.subscribeToSaveResponse(this.instructionService.update(target));
    } else {
      // needs to add progGroupInstruction
      const targetProg: ProgGroupInstruction = {} as ProgGroupInstruction;
      targetProg.instruction = target;
      targetProg.exerciseId = this.selectedExercise.id;
      targetProg.progId = this.selectedProg.id;
      targetProg.groupId = this.selectedExerGroup.id;
      this.subscribeToSaveResponse(this.progGroupInstructionService.create(targetProg));
    }
  }
  protected onSaveSuccessProg(progGroupInstruction: ProgGroupInstruction | null): void {
    if (progGroupInstruction) {
      if (progGroupInstruction.instruction) {
        this.selectedInstruction = progGroupInstruction.instruction;
        this.updateForm(this.selectedInstruction);
        // update cacheTree with new values
        const tree = this.cacheTree.getTreeGroup();
        const progGroupInstructions = tree.progGroupInstructions;
        if (progGroupInstructions) {
          progGroupInstructions.forEach(item => {
            if (item.instruction && this.selectedInstruction && item.instruction.id === this.selectedInstruction.id) {
              item.instruction = this.selectedInstruction;
            }
          });

          tree.progGroupInstructions = progGroupInstructions;
          this.cacheTree.addTreeGroup(tree);
        }
      }
      this.addMode = true;
      this.editMode = true;
    }
  }
  // no exerciseId or Exercise object being populated here  due to unique constraint
  private createInstructionForm(): Instruction {
    return {
      ...new Instruction(),
      id: this.selectedInstruction ? this.selectedInstruction.id : undefined,
      name: this.editForm.get(['name'])!.value,
      repeat: this.editForm.get(['repeat'])!.value,
      hold: this.editForm.get(['hold'])!.value,
      complete: this.editForm.get(['complete'])!.value,
      perform: this.editForm.get(['perform'])!.value,
      note: this.editForm.get(['note'])!.value,
      durationNumber: this.editForm.get(['durationNumber'])!.value,
      duration: this.editForm.get(['duration'])!.value,
      // lastModifiedDate: this.editForm.get(['lastModifiedDate'])!.value
      //   ? moment(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
      //   : undefined,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Instruction>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body));
  }

  protected onSaveSuccess(instruction: Instruction | null): void {
    if (instruction) {
      this.selectedInstruction = instruction;
      this.selectedProgGroupInstruction.instruction = instruction;
      this.updateForm(instruction);
      this.editMode = true;
      const tree = this.cacheTree.getTreeGroup();
      const treeProgInstrcutions = tree.progGroupInstructions;
      if (treeProgInstrcutions) {
        treeProgInstrcutions.forEach(item => {
          if (item.instruction && item.instruction.id === instruction.id) {
            item.instruction = instruction;
          }
        });

        tree.progGroupInstructions = treeProgInstrcutions;
        this.cacheTree.addTreeGroup(tree);
      }
    }
  }

  cancelInstruction() {
    this.selectedInstruction = null;
    this.cancelInstructionEmitter.emit();
  }

  // changeDuration(duration: Event) {
  //   this.editForm.patchValue({
  //     duration: duration.currentTarget,
  //   });
  // }
  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.editMode = true;
      return true;
    } else {
      this.editMode = false;
      return false;
    }
  }

  // replacement of ngOnEdit()
  initUpdateFormByParent(instruction: Instruction) {
    this.updateForm(instruction);
  }

  defaultDuration(duration: string) {
    const formDuration = this.editForm.get(['duration'])!.value;
    if (formDuration === duration) {
      return true;
    }
    return false;
  }

  cancelAdd() {
    this.addMode = false;
    this.editMode = false;
  }

  changeInstruction(instruction: Instruction) {
    this.selectedInstruction = instruction;
    const x: any = document.getElementById('editCheck');

    if (x.checked) {
      const newInstruction = instruction;
      // chek if already exists.
      newInstruction.id = undefined;
      this.updateForm(newInstruction);
    }
  }

  delete(instruction?: Instruction) {
    if (instruction && instruction.id) {
      this.deleteInstructionEmitter.emit(instruction);
    }
  }
}
