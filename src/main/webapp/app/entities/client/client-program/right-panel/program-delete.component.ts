import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Prog } from 'app/entities/prog/prog.model';
import { ProgService } from '../../../prog/service/prog.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'bc-program-delete',
  templateUrl: './program-delete.component.html',
  imports: [FormsModule],
})
export class ProgramDeleteComponent {
  @Input()
  selectedProg!: Prog;

  @Output()
  cancelDeleteEmitter = new EventEmitter();

  @Output()
  confirmDeleteEmitter = new EventEmitter();

  constructor(private progService: ProgService) {}

  clear() {
    this.cancelDeleteEmitter.emit();
  }

  confirmDelete() {
    if (this.selectedProg && this.selectedProg.id) {
      this.progService.delete(this.selectedProg.id).subscribe(() => {
        this.confirmDeleteEmitter.emit();
      });
    }
  }
}
