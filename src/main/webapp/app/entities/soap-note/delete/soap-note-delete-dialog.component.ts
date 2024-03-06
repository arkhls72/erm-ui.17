import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { SoapNote } from '../soap-note.model';
import { SoapNoteService } from '../service/soap-note.service';

@Component({
  standalone: true,
  templateUrl: './soap-note-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SoapNoteDeleteDialogComponent {
  soapNote?: SoapNote;

  constructor(
    protected soapNoteService: SoapNoteService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.soapNoteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
