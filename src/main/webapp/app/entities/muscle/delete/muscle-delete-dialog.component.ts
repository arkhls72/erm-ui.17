import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { Muscle } from '../muscle.model';
import { MuscleService } from '../service/muscle.service';

@Component({
  standalone: true,
  templateUrl: './muscle-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MuscleDeleteDialogComponent {
  muscle?: Muscle;

  constructor(
    protected muscleService: MuscleService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.muscleService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
