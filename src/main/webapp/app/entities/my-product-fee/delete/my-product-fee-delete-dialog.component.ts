import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { MyProductFee } from '../my-product-fee.model';
import { MyProductFeeService } from '../service/my-product-fee.service';

@Component({
  standalone: true,
  templateUrl: './my-product-fee-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MyProductFeeDeleteDialogComponent {
  myProductFee?: MyProductFee;

  constructor(
    protected myProductFeeService: MyProductFeeService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.myProductFeeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
