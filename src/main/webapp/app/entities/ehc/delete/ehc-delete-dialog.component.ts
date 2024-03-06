import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { Ehc } from '../ehc.model';
import { EhcService } from '../service/ehc.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';

@Component({
  standalone: true,
  templateUrl: './ehc-delete-dialog.component.html',
  imports: [SharedModule, FormsModule, FaIconComponent, AlertErrorComponent],
})
export class EhcDeleteDialogComponent {
  ehc?: Ehc;

  constructor(
    protected ehcService: EhcService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ehcService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
