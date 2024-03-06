import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { ParentNode } from 'app/entities/client/client-program/right-panel/tree/parent-node';
import { EachNode } from 'app/entities/client/client-program/right-panel/tree/each-node';

import { Prog } from 'app/entities/prog/prog.model';
import { ProgEdit } from 'app/entities/prog-exer-group/prog-edit.model';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { LocalStorageNavigate } from 'app/entities/local-share/cache/local-storage.navigate';
import { ClientTabNavigateType } from 'app/entities/local-share/clientTabNavigate';
import { ExerciseMedia } from 'app/entities/exercise/exercise-media.model';
import { MediaService } from '../../../../media/service/media.service';
import { ProgExerciseInstruction } from '../../../../prog-exercise-instruction/prog-exercise-instruction.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'bc-tree-exercise-node',
  templateUrl: './tree-exercise-node.component.html',
  imports: [MatTreeModule, MatIconModule],
})
export class TreeExerciseNodeComponent implements OnInit {
  @Input()
  treeDataExercise!: ParentNode[];

  @Input()
  progExerciseInstructions!: ProgExerciseInstruction[];

  @Input()
  exerciseMedia!: ExerciseMedia;

  @Input()
  selectedProg!: Prog;

  @Output()
  instructionEmitter = new EventEmitter<ProgEdit>();

  treeControl: any;
  treeFlattener: any;
  dataSource: any;
  constructor(
    public mediaService: MediaService,
    public cache: LocalStorageNavigate,
  ) {}
  // returns the actual binding object
  _transformer = (node: ParentNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      id: node.id,
      instructionId: node.instructionId,
      firstId: node.firstId,
      secondId: node.secondId,
      level: level,
    };
  };

  hasChild = (_: number, node: EachNode) => node.expandable;

  ngOnInit(): void {
    this.treeControl = new FlatTreeControl<EachNode>(
      node => node.level,
      node => node.expandable,
    );

    this.treeFlattener = new MatTreeFlattener(
      this._transformer,
      node => node.level,
      node => node.expandable,
      node => node.children,
    );

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = this.treeDataExercise;
  }

  addSrcMedia(mediaId?: number) {
    const medias = this.exerciseMedia && this.exerciseMedia.medias ? this.exerciseMedia.medias : [];
    return this.mediaService.addSrcMedia(mediaId, medias);
  }

  // id is exercise.id
  getRepeat(instructionId: number, exerciseId: number) {
    const found = this.progExerciseInstructions
      ? this.progExerciseInstructions.find(item => item.exerciseId === exerciseId && item.instruction?.id === instructionId)
      : undefined;
    if (found && found.instruction) {
      return found.instruction.repeat;
    }
    return '';
  }

  getHold(instructionId: number, exerciseId: number) {
    const found = this.progExerciseInstructions
      ? this.progExerciseInstructions.find(item => item.exerciseId === exerciseId && item.instruction?.id === instructionId)
      : undefined;
    if (found && found.instruction) {
      return found.instruction.hold;
    }
    return '';
  }

  getComplete(instructionId: number, exerciseId: number) {
    const found = this.progExerciseInstructions
      ? this.progExerciseInstructions.find(item => item.exerciseId === exerciseId && item.instruction?.id === instructionId)
      : undefined;
    if (found && found.instruction) {
      return found.instruction.complete;
    }
    return '';
  }

  getPerform(instructionId: number, exerciseId: number) {
    const found = this.progExerciseInstructions
      ? this.progExerciseInstructions.find(item => item.exerciseId === exerciseId && item.instruction?.id === instructionId)
      : undefined;
    if (found && found.instruction) {
      return found.instruction.perform;
    }
    return '';
  }

  getDuration(instructionId: number, exerciseId: number) {
    const found = this.progExerciseInstructions
      ? this.progExerciseInstructions.find(item => item.exerciseId === exerciseId && item.instruction?.id === instructionId)
      : undefined;
    if (found && found.instruction) {
      return found.instruction.duration;
    }
    return '';
  }

  getDurationNum(instructionId: number, exerciseId: number) {
    const found = this.progExerciseInstructions
      ? this.progExerciseInstructions.find(item => item.exerciseId === exerciseId && item.instruction?.id === instructionId)
      : undefined;
    if (found && found.instruction) {
      return found.instruction.durationNumber;
    }
    return '';
  }
  goToInstruction(instructionId: number, exerciseId: number, exerciseName: string) {
    const target = new ProgEdit();

    // const foundIns = this.progExerciseInstructions
    //   ? this.progExerciseInstructions.find(item => item.exerciseId === exerciseId && item.instruction?.id === instructionId)
    //   : undefined;

    const exercise = new Exercise();
    exercise.id = exerciseId;
    exercise.name = exerciseName;
    target.exercise = exercise;
    this.cache.addClientTab(ClientTabNavigateType.PROGRAMS_EDIT_INSTRUCTION.toString());
    this.instructionEmitter.emit(target);
  }
}
