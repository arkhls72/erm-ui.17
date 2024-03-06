import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ServiceType } from '../service-type.model';
import { ServiceTypeService } from '../service/service-type.service';

@Component({
  standalone: true,
  templateUrl: './service-type-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ServiceTypeDeleteDialogComponent {
  serviceType?: ServiceType;

  constructor(
    protected serviceTypeService: ServiceTypeService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.serviceTypeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
