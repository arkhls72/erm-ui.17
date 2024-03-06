import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Plan } from 'app/entities/plan/plan.model';
import { TreatmentEventService } from 'app/entities/local-share/treatment-event.service';
import { PlanService } from '../../../plan/service/plan.service';
@Component({
  standalone: true,
  selector: 'bc-treatment-delete',
  templateUrl: './treatment-delete.component.html',
})
export class TreatmentDeleteComponent {
  @Input()
  plan!: Plan;

  @Output()
  cancelDeleteEmitter = new EventEmitter();

  @Output()
  confirmDeleteEmitter = new EventEmitter();

  constructor(
    private planService: PlanService,
    public eventService: TreatmentEventService,
  ) {}

  clear() {
    this.cancelDeleteEmitter.emit();
  }

  confirmDelete() {
    const plan: any = this.plan;
    this.planService.delete(plan.id).subscribe(() => {
      this.confirmDeleteEmitter.emit();
    });
  }
}
