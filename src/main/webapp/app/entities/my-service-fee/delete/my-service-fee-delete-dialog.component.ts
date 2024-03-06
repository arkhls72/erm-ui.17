import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { MyServiceFee } from '../my-service-fee.model';
import { MyServiceFeeService } from '../service/my-service-fee.service';

@Component({
  standalone: true,
  templateUrl: './my-service-fee-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MyServiceFeeDeleteDialogComponent {
  myServiceFee?: MyServiceFee;

  constructor(
    protected myServiceFeeService: MyServiceFeeService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.myServiceFeeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
