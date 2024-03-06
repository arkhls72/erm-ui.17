import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ProgExerGroup } from '../prog-exer-group.model';
import { ProgExerGroupService } from '../service/prog-exer-group.service';

@Component({
  standalone: true,
  templateUrl: './prog-exer-group-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ProgExerGroupDeleteDialogComponent {
  progExerGroup?: ProgExerGroup;

  constructor(
    protected progExerGroupService: ProgExerGroupService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.progExerGroupService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
