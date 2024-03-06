import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { MyService } from '../my-service.model';
import { MyServiceService } from '../service/my-service.service';

@Component({
  standalone: true,
  templateUrl: './my-service-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MyServiceDeleteDialogComponent {
  myService?: MyService;

  constructor(
    protected myServiceService: MyServiceService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.myServiceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
