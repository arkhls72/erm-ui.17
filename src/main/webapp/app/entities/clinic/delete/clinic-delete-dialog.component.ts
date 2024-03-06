import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { Clinic } from '../clinic.model';
import { ClinicService } from '../service/clinic.service';

@Component({
  standalone: true,
  templateUrl: './clinic-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ClinicDeleteDialogComponent {
  clinic?: Clinic;

  constructor(
    protected clinicService: ClinicService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.clinicService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
