import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SoapNote } from 'app/entities/soap-note/soap-note.model';
import { SoapNoteService } from '../../../soap-note/service/soap-note.service';
import { AlertErrorComponent } from '../../../../shared/alert/alert-error.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'bc-soap-note-delete',
  templateUrl: './soap-note-delete.component.html',
  imports: [AlertErrorComponent, FaIconComponent, FormsModule],
})
export class SoapNoteDeleteComponent {
  @Input()
  soapNote?: SoapNote;

  @Output()
  cancelDeleteEmitter = new EventEmitter();

  @Output()
  confirmDeleteEmitter = new EventEmitter();

  constructor(
    protected soapnoteService: SoapNoteService,
    public activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.cancelDeleteEmitter.emit();
  }

  confirmDelete(id: number): void {
    this.soapnoteService.delete(id).subscribe(() => {
      this.confirmDeleteEmitter.emit(this.soapNote);
    });
  }
}
