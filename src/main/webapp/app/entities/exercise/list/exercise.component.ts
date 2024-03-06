import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { ExerciseEventType } from 'app/entities/local-share/ExerciseEvent';
import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { ExerciseService } from '../service/exercise.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { ExerciseListComponent } from './left-pannel/exercise-list.component';
import { ExerciseAddComponent } from './left-pannel/exercise-add.component';
import { ExerciseListDeleteComponent } from './left-pannel/exercise-list-delete.component';
import { ExerGroupListComponent } from './right-pannel/exer-group-list.component';
import { ExerGroupListDeleteComponent } from './right-pannel/exer-group-list-delete.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'jhi-exercise',
  templateUrl: './exercise.component.html',
  imports: [
    FaIconComponent,
    AlertErrorComponent,
    AlertComponent,
    ExerciseListComponent,
    ExerciseListComponent,
    ExerciseAddComponent,
    ExerciseListDeleteComponent,
    ExerGroupListComponent,
    ExerGroupListDeleteComponent,
    CommonModule,
    RouterLink,
  ],
})
export class ExerciseComponent implements OnInit {
  exerciseEventType = ExerciseEventType.EXER_LIST_VIEW;
  exerGroup!: ExerGroup;
  exercise!: Exercise;

  constructor(
    protected exerciseService: ExerciseService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected modalService: NgbModal,
    public ngIf: NgIf,
    public ngFor: NgFor<any>,
  ) {}

  ngOnInit(): void {}

  previousState(): void {
    window.history.back();
  }
  deleteExercise(excercise: Exercise) {
    if (excercise) {
      this.exercise = excercise;
      this.exerciseEventType = ExerciseEventType.EXER_LIST_VIEW_DELETE;
    }
  }
  cancelDeleteExercise() {
    this.exerciseEventType = ExerciseEventType.EXER_LIST_VIEW;
  }

  // Once received confirm will call the exerciseList to refresh the page.
  confirmDeleteExercise() {
    this.exerciseEventType = ExerciseEventType.EXER_LIST_VIEW;
  }
  deleteExerGroup(exerGroup: ExerGroup) {
    if (exerGroup) {
      this.exerGroup = exerGroup;
      this.exerciseEventType = ExerciseEventType.EXER_GROUP_VIEW_DELETE;
    }
  }
  cancelDeleteExerGroup() {
    this.exerciseEventType = ExerciseEventType.EXER_LIST_VIEW;
  }
  confirmDeleteExerGroup() {
    this.exerciseEventType = ExerciseEventType.EXER_LIST_VIEW;
  }
  addExercise() {
    this.exerciseEventType = ExerciseEventType.EXER_ADD;
  }
  cancelAddExercise() {
    this.exerciseEventType = ExerciseEventType.EXER_LIST_VIEW;
  }
}
