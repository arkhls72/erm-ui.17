import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ExerGroupDetaill } from 'app/entities/exer-group-detaill/exer-group-detaill.model';
import { ExerGroupDetaillService } from '../../../exer-group-detaill/service/exer-group-detaill.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  standalone: true,
  selector: 'bc-group-exercise-list-delete',
  templateUrl: './detail-exercise-list-delete.component.html',
  imports: [FaIconComponent],
})
export class DetailExerciseListDeleteComponent {
  @Input()
  exerciseGroupDetail?: ExerGroupDetaill;

  @Output()
  cancelDeleteGroupExercise = new EventEmitter();

  @Output()
  confirmDeleteGroupExercise = new EventEmitter();

  constructor(
    protected exerciseGroupDetailService: ExerGroupDetaillService,
    public activeModal: NgbActiveModal,
  ) {}

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit(): void {
    // let x: any;
    // if (this.exerciseGroupDetail) {
    //   x = this.exerciseGroupDetail;
    // } else {
    //   x = undefined;
    // }
  }

  cancel(): void {
    this.cancelDeleteGroupExercise.emit();
  }

  confirmDelete(): void {
    if (this.exerciseGroupDetail) {
      const groupId = this.exerciseGroupDetail.exerGroupId;
      const exerciseId = this.exerciseGroupDetail.exercise ? this.exerciseGroupDetail.exercise.id : undefined;

      if (groupId && exerciseId) {
        this.exerciseGroupDetailService.deleteExerciseByGroupId(groupId, exerciseId).subscribe(() => {
          this.confirmDeleteGroupExercise.emit();
        });
      }
    }
  }
}
