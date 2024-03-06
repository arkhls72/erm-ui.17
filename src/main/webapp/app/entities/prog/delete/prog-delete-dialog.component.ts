import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { Prog } from '../prog.model';
import { ProgService } from '../service/prog.service';

@Component({
  standalone: true,
  templateUrl: './prog-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ProgDeleteDialogComponent {
  prog?: Prog;

  constructor(
    protected progService: ProgService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.progService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
