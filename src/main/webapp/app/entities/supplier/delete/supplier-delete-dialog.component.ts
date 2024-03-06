import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { Supplier } from '../supplier.model';
import { SupplierService } from '../service/supplier.service';

@Component({
  standalone: true,
  templateUrl: './supplier-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SupplierDeleteDialogComponent {
  supplier?: Supplier;

  constructor(
    protected supplierService: SupplierService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.supplierService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
