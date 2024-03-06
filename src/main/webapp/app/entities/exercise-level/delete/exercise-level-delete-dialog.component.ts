import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ExerciseLevel } from '../exercise-level.model';
import { ExerciseLevelService } from '../service/exercise-level.service';

@Component({
  standalone: true,
  templateUrl: './exercise-level-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ExerciseLevelDeleteDialogComponent {
  exerciseLevel?: ExerciseLevel;

  constructor(
    protected exerciseLevelService: ExerciseLevelService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.exerciseLevelService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
