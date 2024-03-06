import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { PlanNote } from '../plan-note.model';
import { PlanNoteService } from '../service/plan-note.service';

@Component({
  standalone: true,
  templateUrl: './plan-note-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PlanNoteDeleteDialogComponent {
  planNote?: PlanNote;

  constructor(
    protected planNoteService: PlanNoteService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.planNoteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
