import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { AddGroupExerciseListComponent } from 'app/entities/exer-group/add/right-panel/add-group-exercise-list.component';
import { ExerGroupService } from '../service/exer-group.service';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { AlertComponent } from '../../../shared/alert/alert.component';

@Component({
  selector: 'jhi-exer-group-update',
  templateUrl: './exer-group-add.component.html',
  imports: [AlertErrorComponent, AlertComponent],
  standalone: true,
})
export class ExerGroupAddComponent implements OnInit {
  @ViewChild(AddGroupExerciseListComponent) childRightPanelAddExerciseList!: AddGroupExerciseListComponent;

  isSaving = false;

  selectedExerGroup!: ExerGroup;

  constructor(
    protected exerGroupService: ExerGroupService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {}

  previousState(): void {
    window.history.back();
  }

  initSelectedExerciseGroup(exerGroup?: ExerGroup) {
    if (exerGroup) {
      this.selectedExerGroup = exerGroup;
      this.childRightPanelAddExerciseList.initSelectedExerciseGroup(this.selectedExerGroup);
    }
  }
}
