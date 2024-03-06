import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProgNote } from 'app/entities/prog-note/prog-note.model';
import { DatePipe } from '@angular/common';
import { ProgNoteService } from '../../../prog-note/service/prog-note.service';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'bc-program-note-delete',
  templateUrl: './program-note-delete.component.html',
  imports: [FormsModule],
})
export class ProgramNoteDeleteComponent {
  @Input()
  progNote!: ProgNote;

  @Output()
  cancelDeleteEmitter = new EventEmitter();

  @Output()
  confirmDeleteEmitter = new EventEmitter<ProgNote>();

  constructor(
    private progNoteService: ProgNoteService,
    private datePipe: DatePipe,
  ) {}

  clear() {
    this.cancelDeleteEmitter.emit();
  }

  confirmDelete() {
    if (this.progNote && this.progNote.id) {
      this.progNoteService.delete(this.progNote.id).subscribe(() => {
        this.confirmDeleteEmitter.emit(this.progNote);
      });
    }
  }
  getFormatDate() {
    if (this.progNote && this.progNote.lastModifiedDate) {
      return this.datePipe.transform(this.progNote.lastModifiedDate?.format('YYYY-MM-DD HH:mm'));
    }
    return '';
  }
}
