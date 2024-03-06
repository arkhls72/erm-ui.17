import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { CommonServiceCode } from '../common-service-code.model';
import { CommonServiceCodeService } from '../service/common-service-code.service';

@Component({
  standalone: true,
  templateUrl: './common-service-code-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CommonServiceCodeDeleteDialogComponent {
  commonServiceCode?: CommonServiceCode;

  constructor(
    protected commonServiceCodeService: CommonServiceCodeService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.commonServiceCodeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
