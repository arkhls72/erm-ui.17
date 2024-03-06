import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { Movement } from '../movement.model';
import { MovementService } from '../service/movement.service';

@Component({
  standalone: true,
  templateUrl: './movement-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MovementDeleteDialogComponent {
  movement?: Movement;

  constructor(
    protected movementService: MovementService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.movementService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
