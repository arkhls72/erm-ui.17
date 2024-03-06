import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { ExerGroupDetaill } from 'app/entities/exer-group-detaill/exer-group-detaill.model';
import { ExerciseEventType } from 'app/entities/local-share/ExerciseEvent';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { Instruction } from 'app/entities/instruction/instruction.model';
import { GroupInstructionEditComponent } from 'app/entities/exer-group/detail/right-panel/instruction/group-instruction-edit.component';
import { ExerGroupWrapper } from 'app/entities/exer-group/exer-group-wrapper.model';
import { GroupInstructionInfoComponent } from 'app/entities/exer-group/detail/left-panel/group-instruction-info.component';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { GroupInfoComponent } from './left-panel/group-info.component';
import { DetailExerciseListComponent } from './right-panel/detail-exercise-list.component';
import { DetailExerciseListDeleteComponent } from './right-panel/detail-exercise-list-delete.component';
import { InstructionDeleteListComponent } from './right-panel/instruction/instruction-delete-list.component';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'jhi-exer-group-detail',
  templateUrl: './exer-group-detail.component.html',
  imports: [
    AlertComponent,
    AlertErrorComponent,
    GroupInfoComponent,
    DetailExerciseListComponent,
    DetailExerciseListDeleteComponent,
    GroupInstructionInfoComponent,
    GroupInstructionEditComponent,
    InstructionDeleteListComponent,
    NgIf,
  ],
})
export class ExerGroupDetailComponent implements OnInit {
  @ViewChild(GroupInstructionEditComponent) childDetailGroupInstruction!: GroupInstructionEditComponent;
  @ViewChild(GroupInstructionInfoComponent) childGroupInstructionList!: GroupInstructionInfoComponent;

  exerGroup!: ExerGroup;
  exerciseEvent = ExerciseEventType.EXER_GROUP_EXERCISE_VIEW;
  exerciseGroupDetail!: ExerGroupDetaill;
  selectedExercise!: Exercise;
  selectedInstruction!: Instruction | undefined;

  exerGroupWrapper!: ExerGroupWrapper;
  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exerGroup }) => (this.exerGroup = exerGroup));
  }

  previousState(): void {
    window.history.back();
  }

  deleteGroupExerciseDetail(exerciseGroupDetail: ExerGroupDetaill) {
    this.exerciseGroupDetail = exerciseGroupDetail;
    this.exerciseEvent = ExerciseEventType.EXER_GROUP_EXERCISE_DELETE;
  }
  backToExerciseView() {
    this.selectedInstruction = undefined;
    this.exerciseEvent = ExerciseEventType.EXER_GROUP_EXERCISE_VIEW;
  }
  // calling when instruction button clicked.
  editInstruction(exerciseGroupWrapper: ExerGroupWrapper) {
    if (exerciseGroupWrapper && exerciseGroupWrapper.exercise) {
      this.selectedExercise = exerciseGroupWrapper.exercise;
    }

    this.exerGroupWrapper = exerciseGroupWrapper;
    this.exerGroupWrapper.exerciseId = this.selectedExercise.id;
    this.exerGroupWrapper.exerGroupDetailId = exerciseGroupWrapper.exerGroupDetailId;
    this.exerciseEvent = ExerciseEventType.EXER_GROUP_INSTRUCTION;
  }

  addNewInstruction() {
    const target = new ExerGroupWrapper();

    if (this.selectedExercise) {
      target.exercise = this.selectedExercise;
    }

    if (this.exerGroup) {
      target.exerGroupId = this.exerGroup.id;
    }
    const newInstruction = new Instruction();
    newInstruction.duration = 'Daily';
    newInstruction.exerciseId = this.selectedExercise.id;
    newInstruction.complete = 1;
    newInstruction.hold = 1;
    newInstruction.perform = 1;
    newInstruction.repeat = 1;
    newInstruction.durationNumber = 1;
    target.exerGroupDetailId = this.exerGroupWrapper.exerGroupDetailId;
    target.instruction = newInstruction;
    target.exerciseId = this.selectedExercise.id;
    this.childDetailGroupInstruction.initNewFormByParent(target);
  }

  // cancel addInstruction and revert the status back to view
  cancelAddInstruction() {
    this.exerciseEvent = ExerciseEventType.EXER_GROUP_INSTRUCTION;
  }

  deleteInstruction(instruction: Instruction) {
    this.selectedInstruction = instruction;
    this.exerciseEvent = ExerciseEventType.EXER_INSTRUCTION_DELETE;
  }
  cancelDeleteInstruction() {
    this.exerciseEvent = ExerciseEventType.EXER_GROUP_INSTRUCTION;
  }
}
