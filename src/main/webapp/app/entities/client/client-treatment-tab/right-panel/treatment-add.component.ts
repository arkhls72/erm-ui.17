import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Plan } from 'app/entities/plan/plan.model';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { TreatmentEventType } from 'app/entities/local-share/treatmentEvent';
import { HttpResponse } from '@angular/common/http';
import { Client } from 'app/entities/client/client.model';
import { PlanNote } from 'app/entities/plan-note/plan-note.model';
import { PlanService } from '../../../plan/service/plan.service';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';
@Component({
  standalone: true,
  selector: 'bc-treatment-add',
  templateUrl: './treatment-add.component.html',
  imports: [FormsModule, FaIconComponent, NgbInputDatepicker, NgIf],
})
export class TreatmentAddComponent implements OnInit {
  plan!: Plan;

  @Input()
  client!: Client;

  @Output()
  cancelAddTreatmentEmitter = new EventEmitter();

  @Output()
  confirmedAddTreatmentEmitter = new EventEmitter();

  @Input()
  selectedAssessment!: Assessment;
  ifSelected!: boolean;
  links: any;
  totalItems: any;
  queryCount: any;
  itemsPerPage: any;
  destinationPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  currentSearch!: string;
  currentAccount: any;
  startDateDp: any;
  endDateDp: any;
  assessments!: Assessment[];

  ifEmptyAssessment!: boolean;
  selecetdAssessment!: Assessment;
  eventSubscriber!: Subscription;
  treatmentEventType: TreatmentEventType = TreatmentEventType.TREATMENT_SELECT_ASSESSMENT;

  constructor(private planService: PlanService) {}

  ngOnInit() {
    this.plan = {} as Plan;
  }
  save() {
    if (!this.plan) {
      this.plan = {} as Plan;
    }
    this.plan.clientId = this.client.id;
    this.plan.assessmentId = this.selectedAssessment.id;
    this.subscribeToSaveResponse(this.planService.create(this.plan));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Plan>>): void {
    result.subscribe(r => this.onSaveSuccess(r));
  }

  private onSaveSuccess(r: HttpResponse<Plan>) {
    if (!this.plan) {
      this.plan = {} as Plan;
    }
    if (r && r.body) {
      this.plan = r.body;
      this.confirmedAddTreatmentEmitter.emit(this.plan);
    }
  }
  isSelected(assessment: any): boolean {
    if (this.selecetdAssessment !== undefined && this.selecetdAssessment.id === assessment.id) {
      this.ifEmptyAssessment = false;
      return true;
    }
    return false;
  }

  trackId(index: number, item: Assessment): number {
    return item.id!;
  }

  backToTreatmentTab() {
    this.cancelAddTreatmentEmitter.emit();
  }

  isNoteModified(note: string) {
    if (this.plan && !this.plan.clinicalNote) {
      this.plan.clinicalNote = {} as PlanNote;
    }
    const copy: any = note;
    this.plan.clinicalNote!.note = copy;
  }

  initAssessmentFromParent(assessment: Assessment) {
    this.selectedAssessment = assessment;
  }
}
