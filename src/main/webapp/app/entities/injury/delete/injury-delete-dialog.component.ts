import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { Injury } from '../injury.model';
import { InjuryService } from '../service/injury.service';

@Component({
  standalone: true,
  templateUrl: './injury-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class InjuryDeleteDialogComponent {
  injury?: Injury;

  constructor(
    protected injuryService: InjuryService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.injuryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
