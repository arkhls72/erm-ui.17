import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Instruction } from 'app/entities/instruction/instruction.model';
import { InstructionService } from '../../../../instruction/service/instruction.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from '../../../../../shared/alert/alert-error.component';
import { AlertComponent } from '../../../../../shared/alert/alert.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'bc-instruction-delete-list',
  templateUrl: './instruction-delete-list.component.html',
  imports: [FaIconComponent, AlertComponent, AlertErrorComponent, FormsModule],
})
export class InstructionDeleteListComponent {
  @Input()
  instruction?: Instruction;

  @Output()
  cancelDeleteInstructionEmitter = new EventEmitter();

  constructor(
    protected instructionService: InstructionService,
    public activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.cancelDeleteInstructionEmitter.emit();
  }

  confirmDelete(id: number): void {
    this.instructionService.delete(id).subscribe(() => {
      this.cancelDeleteInstructionEmitter.emit();
    });
  }
}
