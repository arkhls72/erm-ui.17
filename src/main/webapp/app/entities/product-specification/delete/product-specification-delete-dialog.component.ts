import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ProductSpecification } from '../product-specification.model';
import { ProductSpecificationService } from '../service/product-specification.service';

@Component({
  standalone: true,
  templateUrl: './product-specification-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ProductSpecificationDeleteDialogComponent {
  productSpecification?: ProductSpecification;

  constructor(
    protected productSpecificationService: ProductSpecificationService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productSpecificationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
