import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ExerciseType } from '../exercise-type.model';
import { ExerciseTypeService } from '../service/exercise-type.service';

@Component({
  standalone: true,
  templateUrl: './exercise-type-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ExerciseTypeDeleteDialogComponent {
  exerciseType?: ExerciseType;

  constructor(
    protected exerciseTypeService: ExerciseTypeService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.exerciseTypeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
