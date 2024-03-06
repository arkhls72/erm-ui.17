import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { EhcClient } from '../ehc-client.model';
import { EhcClientService } from '../service/ehc-client.service';

@Component({
  standalone: true,
  templateUrl: './ehc-client-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EhcClientDeleteDialogComponent {
  ehcClient?: EhcClient;

  constructor(
    protected ehcClientService: EhcClientService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ehcClientService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
