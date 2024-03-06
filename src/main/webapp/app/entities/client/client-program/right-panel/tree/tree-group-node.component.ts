import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { ParentNode } from 'app/entities/client/client-program/right-panel/tree/parent-node';
import { EachNode } from 'app/entities/client/client-program/right-panel/tree/each-node';
import { GroupExerciseMedia } from 'app/entities/exercise/group-exercise-media.model';
import { ProgGroupInstruction } from 'app/entities/prog-group-instruction/prog-group-instruction.model';
import { Prog } from 'app/entities/prog/prog.model';
import { ProgEdit } from 'app/entities/prog-exer-group/prog-edit.model';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { LocalStorageNavigate } from 'app/entities/local-share/cache/local-storage.navigate';
import { ClientTabNavigateType } from 'app/entities/local-share/clientTabNavigate';
import { MediaService } from '../../../../media/service/media.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'bc-tree-group-node',
  templateUrl: './tree-group-node.component.html',

  imports: [MatTreeModule, MatIconModule],
})
export class TreeGroupNodeComponent implements OnInit {
  @Input()
  treeData!: ParentNode[];

  @Input()
  progGroupInstructions!: ProgGroupInstruction[];

  @Input()
  groupList!: GroupExerciseMedia[];

  @Output()
  instructionEmitter = new EventEmitter<ProgEdit>();
  @Input()
  selectedProg!: Prog;

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
      groupId: node.groupId,
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
    this.dataSource.data = this.treeData;
  }

  addSrcMedia(mediaId?: number, groupId?: number) {
    const found = this.groupList.find(p => p.exerGroup!.id === groupId);
    if (found && found.exerciseMedia) {
      return this.mediaService.addSrcMedia(mediaId, found.exerciseMedia.medias);
    }
    return null;
  }

  // id is exercise.id
  getRepeat(groupId: number, exerciseId: number) {
    const found = this.progGroupInstructions
      ? this.progGroupInstructions.find(item => item.exerciseId === exerciseId && item.groupId === groupId)
      : undefined;
    if (found && found.instruction) {
      return found.instruction.repeat;
    }
    return '';
  }

  getHold(groupId: number, exerciseId: number) {
    const found = this.progGroupInstructions
      ? this.progGroupInstructions.find(item => item.exerciseId === exerciseId && item.groupId === groupId)
      : undefined;
    if (found && found.instruction) {
      return found.instruction.hold;
    }
    return '';
  }

  getComplete(groupId: number, exerciseId: number) {
    const found = this.progGroupInstructions
      ? this.progGroupInstructions.find(item => item.exerciseId === exerciseId && item.groupId === groupId)
      : undefined;
    if (found && found.instruction) {
      return found.instruction.complete;
    }
    return '';
  }

  getPerform(groupId: number, exerciseId: number) {
    const found = this.progGroupInstructions
      ? this.progGroupInstructions.find(item => item.exerciseId === exerciseId && item.groupId === groupId)
      : undefined;
    if (found && found.instruction) {
      return found.instruction.perform;
    }
    return '';
  }

  getDuration(groupId: number, exerciseId: number) {
    const found = this.progGroupInstructions
      ? this.progGroupInstructions.find(item => item.exerciseId === exerciseId && item.groupId === groupId)
      : undefined;
    if (found && found.instruction) {
      return found.instruction.duration;
    }
    return '';
  }

  getDurationNum(groupId: number, exerciseId: number) {
    const found = this.progGroupInstructions
      ? this.progGroupInstructions.find(item => item.exerciseId === exerciseId && item.groupId === groupId)
      : undefined;
    if (found && found.instruction) {
      return found.instruction.durationNumber;
    }
    return '';
  }
  goToInstruction(groupId: number, exerciseId: number, exerciseName: string) {
    const target = new ProgEdit();

    const foundIns = this.progGroupInstructions
      ? this.progGroupInstructions.find(item => item.exerciseId === exerciseId && item.groupId === groupId)
      : undefined;
    const foundGroup = this.groupList.find(it => it.exerGroup && it.exerGroup.id === groupId);
    if (foundIns && foundIns.instruction) {
      target.progGroupInstruction = foundIns;
    }
    if (foundGroup && foundGroup.exerGroup) {
      target.group = foundGroup.exerGroup;
    }

    const exercise = new Exercise();
    exercise.id = exerciseId;
    exercise.name = exerciseName;
    target.exercise = exercise;
    this.cache.addClientTab(ClientTabNavigateType.PROGRAMS_EDIT_INSTRUCTION.toString());
    this.instructionEmitter.emit(target);
  }
}
