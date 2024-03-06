import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlanNote } from 'app/entities/plan-note/plan-note.model';
import { DatePipe } from '@angular/common';
import { PlanNoteService } from '../../../../plan-note/service/plan-note.service';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'bc-treatment-note-delete',
  templateUrl: './treatment-note-delete.component.html',
  imports: [FormsModule],
})
export class TreatmentNoteDeleteComponent implements OnInit {
  @Input()
  planNote!: PlanNote;

  @Output()
  cancelNoteDeleteEmitter = new EventEmitter<PlanNote>();

  @Output()
  confirmNoteDeleteEmitter = new EventEmitter<PlanNote>();

  constructor(
    private planNoteService: PlanNoteService,
    private datePipe: DatePipe,
  ) {}

  clear() {
    this.cancelNoteDeleteEmitter.emit(this.planNote);
  }

  confirmTreatmentDelete() {
    const planNote: PlanNote = this.planNote;
    this.planNoteService.delete(planNote.id).subscribe(() => {
      this.confirmNoteDeleteEmitter.emit(planNote);
    });
  }

  ngOnInit(): void {}
  getFormatDate() {
    if (this.planNote && this.planNote.lastModifiedDate) {
      return this.datePipe.transform(this.planNote.lastModifiedDate.format('YYYY-MM-DD HH:mm'));
    }
    return '';
  }
}
