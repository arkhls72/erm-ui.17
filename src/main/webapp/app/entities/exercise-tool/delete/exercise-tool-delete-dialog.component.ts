import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from '../../../shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ExerciseTool } from '../exercise-tool.model';
import { ExerciseToolService } from '../service/exercise-tool.service';

@Component({
  standalone: true,
  templateUrl: './exercise-tool-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ExerciseToolDeleteDialogComponent {
  exerciseTool?: ExerciseTool;

  constructor(
    protected exerciseToolService: ExerciseToolService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.exerciseToolService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
