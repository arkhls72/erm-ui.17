import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ExerGroup } from '../exer-group.model';
import { ExerGroupService } from '../service/exer-group.service';

@Component({
  standalone: true,
  templateUrl: './exer-group-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ExerGroupDeleteDialogComponent {
  exerGroup?: ExerGroup;

  constructor(
    protected exerGroupService: ExerGroupService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.exerGroupService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
