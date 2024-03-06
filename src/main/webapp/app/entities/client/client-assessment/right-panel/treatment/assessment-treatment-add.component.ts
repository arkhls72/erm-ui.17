import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Plan } from 'app/entities/plan/plan.model';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { TreatmentEvent, TreatmentEventType } from 'app/entities/local-share/treatmentEvent';
import { HttpResponse } from '@angular/common/http';
import { Client } from 'app/entities/client/client.model';
import { PlanNote } from 'app/entities/plan-note/plan-note.model';
import { SoapNote } from 'app/entities/soap-note/soap-note.model';
import { ClientTabNavigateType } from 'app/entities/local-share/clientTabNavigate';
import { LocalStorageNavigate } from 'app/entities/local-share/cache/local-storage.navigate';
import { PlanService } from '../../../../plan/service/plan.service';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-input';
import { NgIf } from '@angular/common';
const thisEventSource = 'clinical-add';
@Component({
  standalone: true,
  selector: 'bc-assessment-treatment-add',
  templateUrl: './assessment-treatment-add.component.html',
  imports: [FormsModule, FaIconComponent, NgbInputDatepicker, NgIf],
})
export class AssessmentTreatmentAddComponent implements OnInit {
  @Input()
  assessment!: Assessment;
  soapNote!: SoapNote;

  plan!: Plan;

  @Input()
  client!: Client;

  @Output()
  cancelAddTreatmentEmitter = new EventEmitter();

  @Output()
  backToSelectAssessmentEmitter = new EventEmitter<Assessment>();

  @Output()
  confirmedAddTreatmentEmitter = new EventEmitter<Plan>();

  @Output()
  confirmedAddTreatmentFromSoapNoteEmitter = new EventEmitter<Plan>();

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

  constructor(
    private planService: PlanService,
    private cache: LocalStorageNavigate,
  ) {}

  ngOnInit() {
    this.plan = {} as Plan;
    if (!this.assessment) {
      this.assessment = {} as Assessment;
    }
  }

  clear() {
    this.treatmentEventType = TreatmentEventType.BACK;
  }

  save() {
    if (!this.plan) {
      this.plan = {} as Plan;
    }
    this.plan.clientId = this.client.id;
    this.plan.assessmentId = this.assessment.id;
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
      const x: string = this.cache.getClientTab();
      if (x === ClientTabNavigateType.SOAPNOTES.toString()) {
        this.confirmedAddTreatmentFromSoapNoteEmitter.emit(this.plan);
      } else {
        this.confirmedAddTreatmentEmitter.emit(this.plan);
      }
    }
  }
  private onAssessmentEvent(evt: TreatmentEvent): void {
    if (evt.source && evt.source === thisEventSource) {
      return;
    }
  }

  isSelected(assessment: any): boolean {
    if (this.selecetdAssessment !== undefined && this.selecetdAssessment.id === assessment.id) {
      this.ifEmptyAssessment = false;
      return true;
    }
    return false;
  }

  addOrRemoveAssessment(assessment: Assessment, checked: Boolean) {
    if (checked) {
      const foundElement: any = this.assessments.find(item => item.id === assessment.id);
      this.ifEmptyAssessment = false;
      this.assessment = foundElement;
      if (this.plan) {
        this.plan.assessmentId = this.assessment.id;
      }
    }
  }
  trackId(index: number, item: Assessment): number {
    return item.id!;
  }

  backToTreatmentTab() {
    this.cancelAddTreatmentEmitter.emit();
  }

  backToSelectAssessment() {
    this.backToSelectAssessmentEmitter.emit(this.assessment);
  }
  isNoteModified(note: string) {
    if (this.plan && !this.plan.clinicalNote) {
      this.plan.clinicalNote = {} as PlanNote;
    }
    this.plan.clinicalNote!.note = note;
  }
}
