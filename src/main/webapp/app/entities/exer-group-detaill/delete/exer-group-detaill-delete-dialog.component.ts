import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ExerGroupDetaill } from '../exer-group-detaill.model';
import { ExerGroupDetaillService } from '../service/exer-group-detaill.service';

@Component({
  standalone: true,
  templateUrl: './exer-group-detaill-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ExerGroupDetaillDeleteDialogComponent {
  exerGroupDetaill?: ExerGroupDetaill;

  constructor(
    protected exerGroupDetaillService: ExerGroupDetaillService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.exerGroupDetaillService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
