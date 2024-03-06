import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { AssessmentEventType } from 'app/entities/local-share/assessmentEvent';
import { AssessmentEventService } from 'app/entities/local-share/assessment-event.service';
import { ClientTabNavigateType } from 'app/entities/local-share/clientTabNavigate';
import { LocalStorageNavigate } from 'app/entities/local-share/cache/local-storage.navigate';
import { AssessmentService } from '../../../assessment/service/assessment.service';
import { AlertErrorComponent } from '../../../../shared/alert/alert-error.component';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'bc-assessment-delete',
  templateUrl: './assessment-delete.component.html',
  imports: [AlertErrorComponent, FormsModule],
})
export class AssessmentDeleteComponent {
  @Input()
  assessment!: Assessment;

  @Output()
  cancelDeleteEmitter = new EventEmitter();

  @Output()
  confirmDeleteEmitter = new EventEmitter();

  @Output()
  confirmDeleteFromSoapNoteEmitter = new EventEmitter();

  assessmentEventType: AssessmentEventType = AssessmentEventType.ASSESSMENT_DELETE;
  constructor(
    private assessmentService: AssessmentService,
    public eventService: AssessmentEventService,
    public cache: LocalStorageNavigate,
  ) {}

  clear() {
    this.cancelDeleteEmitter.emit();
  }

  confirmDelete() {
    const assessment: any = this.assessment;
    this.assessmentService.delete(assessment.id).subscribe(() => {
      const x: string = this.cache.getClientTab();
      if (x === ClientTabNavigateType.SOAPNOTES.toString()) {
        this.confirmDeleteFromSoapNoteEmitter.emit(assessment);
      } else {
        this.confirmDeleteEmitter.emit();
      }
    });
  }
}
