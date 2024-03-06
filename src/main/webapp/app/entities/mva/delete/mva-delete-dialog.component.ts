import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { Mva } from '../mva.model';
import { MvaService } from '../service/mva.service';

@Component({
  standalone: true,
  templateUrl: './mva-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MvaDeleteDialogComponent {
  mva?: Mva;

  constructor(
    protected mvaService: MvaService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mvaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
