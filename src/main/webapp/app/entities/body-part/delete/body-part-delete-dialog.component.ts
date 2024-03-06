import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { BodyPart } from '../body-part.model';
import { BodyPartService } from '../service/body-part.service';

@Component({
  standalone: true,
  templateUrl: './body-part-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BodyPartDeleteDialogComponent {
  bodyPart?: BodyPart;

  constructor(
    protected bodyPartService: BodyPartService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bodyPartService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
