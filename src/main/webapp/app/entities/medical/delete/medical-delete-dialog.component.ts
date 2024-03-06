import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { Medical } from '../medical.model';
import { MedicalService } from '../service/medical.service';

@Component({
  standalone: true,
  templateUrl: './medical-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MedicalDeleteDialogComponent {
  medical?: Medical;

  constructor(
    protected medicalService: MedicalService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.medicalService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
