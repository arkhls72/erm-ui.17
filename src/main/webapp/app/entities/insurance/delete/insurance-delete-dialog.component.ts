import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { Insurance } from '../insurance.model';
import { InsuranceService } from '../service/insurance.service';

@Component({
  standalone: true,
  templateUrl: './insurance-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class InsuranceDeleteDialogComponent {
  insurance?: Insurance;

  constructor(
    protected insuranceService: InsuranceService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.insuranceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
