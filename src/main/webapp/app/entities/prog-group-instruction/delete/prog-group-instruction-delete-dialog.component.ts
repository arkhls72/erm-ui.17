import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ProgGroupInstruction } from '../prog-group-instruction.model';
import { ProgGroupInstructionService } from '../service/prog-group-instruction.service';

@Component({
  standalone: true,
  templateUrl: './prog-group-instruction-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ProgGroupInstructionDeleteDialogComponent {
  progGroupInstruction?: ProgGroupInstruction;

  constructor(
    protected progGroupInstructionService: ProgGroupInstructionService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.progGroupInstructionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
