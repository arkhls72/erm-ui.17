import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { Wsib } from '../wsib.model';
import { WsibService } from '../service/wsib.service';

@Component({
  standalone: true,
  templateUrl: './wsib-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class WsibDeleteDialogComponent {
  wsib?: Wsib;

  constructor(
    protected wsibService: WsibService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.wsibService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
