import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { Condition } from '../condition.model';
import { ConditionService } from '../service/condition.service';

@Component({
  standalone: true,
  templateUrl: './condition-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ConditionDeleteDialogComponent {
  condition?: Condition;

  constructor(
    protected conditionService: ConditionService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.conditionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
