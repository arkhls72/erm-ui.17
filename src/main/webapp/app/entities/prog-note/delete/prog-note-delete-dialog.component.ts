import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ProgNote } from '../prog-note.model';
import { ProgNoteService } from '../service/prog-note.service';

@Component({
  standalone: true,
  templateUrl: './prog-note-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ProgNoteDeleteDialogComponent {
  progNote?: ProgNote;

  constructor(
    protected progNoteService: ProgNoteService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.progNoteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
