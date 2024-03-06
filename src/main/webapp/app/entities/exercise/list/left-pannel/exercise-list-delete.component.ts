import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Exercise } from 'app/entities/exercise/exercise.model';
import { ExerciseService } from '../../service/exercise.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'bc-exercise-list-delete',
  templateUrl: './exercise-list-delete.component.html',
  imports: [FaIconComponent, CommonModule, FormsModule],
})
export class ExerciseListDeleteComponent {
  @Input()
  exercise?: Exercise;

  @Output()
  cancelDeleteExercise = new EventEmitter();

  @Output()
  confirmDeleteExercise = new EventEmitter();

  constructor(
    protected exerciseService: ExerciseService,
    public activeModal: NgbActiveModal,
    public ngIf: NgIf,
    public ngFor: NgFor<any>,
  ) {}

  cancel(): void {
    this.cancelDeleteExercise.emit();
  }

  confirmDelete(): void {
    if (this.exercise) {
      this.exerciseService.delete(this.exercise.id!).subscribe(() => {
        this.confirmDeleteExercise.emit();
      });
    }
  }
}
