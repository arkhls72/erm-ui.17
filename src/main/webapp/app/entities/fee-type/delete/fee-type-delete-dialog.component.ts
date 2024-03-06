import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { FeeType } from '../fee-type.model';
import { FeeTypeService } from '../service/fee-type.service';

@Component({
  standalone: true,
  templateUrl: './fee-type-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class FeeTypeDeleteDialogComponent {
  feeType?: FeeType;

  constructor(
    protected feeTypeService: FeeTypeService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.feeTypeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
