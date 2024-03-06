import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { Therapy } from '../therapy.model';
import { TherapyService } from '../service/therapy.service';

@Component({
  standalone: true,
  templateUrl: './therapy-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TherapyDeleteDialogComponent {
  therapy?: Therapy;

  constructor(
    protected therapyService: TherapyService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.therapyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
