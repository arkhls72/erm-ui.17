import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Plan } from 'app/entities/plan/plan.model';

import { TreatmentEventService } from 'app/entities/local-share/treatment-event.service';
import { ClientTabNavigate, ClientTabNavigateType } from 'app/entities/local-share/clientTabNavigate';
import { LocalStorageNavigate } from 'app/entities/local-share/cache/local-storage.navigate';
import { PlanService } from '../../../../plan/service/plan.service';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'bc-assessment-treatment-delete',
  templateUrl: './assessment-treatment-delete.component.html',
  imports: [FormsModule],
})
export class AssessmentTreatmentDeleteComponent {
  @Input()
  clientTab!: ClientTabNavigate;

  @Input()
  plan!: Plan;

  @Output()
  cancelTreatmentDeleteEmitter = new EventEmitter<Plan>();

  @Output()
  confirmDelAssessmentTabTreatmentEmitter = new EventEmitter<Plan>();

  @Output()
  confirmDelSoapNoteTabTreatmentEmitter = new EventEmitter<Plan>();

  constructor(
    private planService: PlanService,
    public eventService: TreatmentEventService,
    public cache: LocalStorageNavigate,
  ) {}

  clear() {
    this.cancelTreatmentDeleteEmitter.emit(this.plan);
  }

  confirmTreatmentDelete() {
    const plan: Plan = this.plan;
    this.planService.delete(plan.id).subscribe(() => {
      const x: string = this.cache.getClientTab();
      if (x === ClientTabNavigateType.SOAPNOTES.toString()) {
        this.confirmDelSoapNoteTabTreatmentEmitter.emit(plan);
      } else {
        this.confirmDelAssessmentTabTreatmentEmitter.emit(plan);
      }
    });
  }
}
