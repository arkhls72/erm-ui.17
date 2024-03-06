import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { EhcPrimary } from '../ehc-primary.model';
import { EhcPrimaryService } from '../service/ehc-primary.service';

@Component({
  standalone: true,
  templateUrl: './ehc-primary-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EhcPrimaryDeleteDialogComponent {
  ehcPrimary?: EhcPrimary;

  constructor(
    protected ehcPrimaryService: EhcPrimaryService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ehcPrimaryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
