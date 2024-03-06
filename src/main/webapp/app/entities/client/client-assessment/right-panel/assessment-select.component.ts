import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Plan } from 'app/entities/plan/plan.model';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { AssessmentEventType } from 'app/entities/local-share/assessmentEvent';
import { AssessmentEventService } from 'app/entities/local-share/assessment-event.service';

import { HttpResponse } from '@angular/common/http';
import { Client } from 'app/entities/client/client.model';
import { DatePipe, NgForOf, NgIf } from '@angular/common';

import { AggravationPain } from 'app/entities/assessment/aggravationPain.model';
import { SoapNote } from 'app/entities/soap-note/soap-note.model';
import { LocalStorageNavigate } from 'app/entities/local-share/cache/local-storage.navigate';
import { ClientTabNavigateType } from 'app/entities/local-share/clientTabNavigate';
import { AssessmentService } from '../../../assessment/service/assessment.service';
import { PainOnset } from '../../../painOnset.model';
import dayjs from 'dayjs/esm';
import { FormsModule } from '@angular/forms';
import { AssessmentTreatmentDeleteComponent } from './treatment/assessment-treatment-delete.component';

@Component({
  standalone: true,
  selector: 'bc-assessment-select',
  templateUrl: './assessment-select.component.html',
  imports: [FormsModule, AssessmentTreatmentDeleteComponent, NgForOf, NgIf],
})
export class AssessmentSelectComponent implements OnInit {
  deleteSelectedPlan = false;
  editMode = false;

  @Input()
  client: Client = {} as Client;

  @Input()
  selectedAssessment!: Assessment;

  selectedPlan!: Plan;

  @Output()
  updateAssessmentEmitter = new EventEmitter();

  @Output()
  updateSoapNoteAssessmentEmitter = new EventEmitter<Assessment>();

  @Output()
  deleteSelectedEventEmitter = new EventEmitter();

  @Output()
  goToTreatmentViewEmitter = new EventEmitter<Plan>();

  @Output()
  addTreatmentEmitter = new EventEmitter();

  @Output()
  backToParentEmitter = new EventEmitter<SoapNote>();

  @Output()
  confirmDeleteTreatmentEmitter = new EventEmitter<Plan>();

  eventSubscriber!: Subscription;
  currentAccount: any;
  startDateDp: any;
  endDateDp: any;

  assessmentEventType: AssessmentEventType = AssessmentEventType.ASSESSMENT_VIEW;
  constructor(
    public assessmentEventService: AssessmentEventService,
    private assessmentService: AssessmentService,
    private cache: LocalStorageNavigate,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {
    if (!this.selectedAssessment) {
      this.selectedAssessment = {} as Assessment;
    }
  }

  initSelectedAssessment(assessment: Assessment) {
    this.selectedAssessment = assessment;
  }

  save() {
    this.initEmptyRadios();
    const assessment: Assessment = this.selectedAssessment;
    if (!assessment.painOnSet) {
      assessment.painOnSet = {} as PainOnset;
    }
    if (!assessment.aggravationPain) {
      assessment.aggravationPain = new AggravationPain();
    }

    this.subscribeToSaveResponse(this.assessmentService.update(assessment));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Assessment>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body));
  }

  private onSaveSuccess(assessment?: Assessment | null) {
    if (assessment) {
      this.selectedAssessment = assessment;
      const x: string = this.cache.getClientTab();
      if (x === ClientTabNavigateType.SOAPNOTES.toString()) {
        this.updateSoapNoteAssessmentEmitter.emit(assessment);
      } else {
        this.updateAssessmentEmitter.emit();
      }
    }
  }

  addOrRemoveOnset(event: Event, t: any) {
    const target = event.target as HTMLInputElement;
    if (!this.selectedAssessment) {
      this.selectedAssessment = {} as Assessment;
      this.selectedAssessment.painOnSet = new PainOnset();
    }
    if (this.selectedAssessment && !this.selectedAssessment.painOnSet) {
      this.selectedAssessment.painOnSet = new PainOnset();
    }

    if (t === 'sudden') {
      if (target.checked) {
        this.selectedAssessment.painOnSet!.sudden = true;
      } else {
        this.selectedAssessment.painOnSet!.sudden = false;
      }
    }
    if (t === 'gradual') {
      if (target.checked) {
        this.selectedAssessment.painOnSet!.gradual = true;
      } else {
        this.selectedAssessment.painOnSet!.gradual = false;
      }
    }
  }

  isSuddenSelected() {
    const foundAssessment: Assessment = this.selectedAssessment;

    if (foundAssessment && foundAssessment.painOnSet && foundAssessment.painOnSet.sudden === true) {
      return true;
    }
    return false;
  }
  isGradualSelected() {
    const foundAssessment: Assessment = this.selectedAssessment;

    if (foundAssessment && foundAssessment.painOnSet && foundAssessment.painOnSet.gradual === true) {
      return true;
    }
    return false;
  }

  isThrobbingSelected() {
    const foundAssessment: Assessment = this.selectedAssessment;

    if (foundAssessment && foundAssessment.aggravationPain && foundAssessment.aggravationPain.throbbing === true) {
      return true;
    }
    return false;
  }

  addOrRemoveAggravation(event: Event, t: any) {
    const target = event.target as HTMLInputElement;
    const assessment: Assessment = this.selectedAssessment;
    if (assessment && assessment.aggravationPain && t === 'sharp') {
      if (target.checked) {
        assessment.aggravationPain.sharp = true;
      } else {
        assessment.aggravationPain.sharp = false;
      }
    }
    if (assessment && assessment.aggravationPain && t === 'throbbing') {
      if (target.checked) {
        assessment.aggravationPain.throbbing = true;
      } else {
        assessment.aggravationPain.throbbing = false;
      }
    }
  }

  isSharpSelected() {
    const foundAssessment: any = this.selectedAssessment;

    if (foundAssessment && foundAssessment.aggravationPain && foundAssessment.aggravationPain.sharp === true) {
      return true;
    }

    return false;
  }

  delete() {
    this.deleteSelectedEventEmitter.emit(this.selectedAssessment);
  }

  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    this.editMode = target.checked ? true : false;
    return this.editMode;
  }

  addTreatment() {
    this.addTreatmentEmitter.emit();
  }
  initEmptyRadios() {
    if (!this.selectedAssessment.aggravationPain) {
      this.selectedAssessment.aggravationPain = new AggravationPain();
    }
    if (!this.selectedAssessment.painOnSet) {
      this.selectedAssessment.painOnSet = new PainOnset();
    }

    if (!this.selectedAssessment.aggravationPain.sharp) {
      this.selectedAssessment.aggravationPain.sharp = false;
    }

    if (!this.selectedAssessment.aggravationPain.throbbing) {
      this.selectedAssessment.aggravationPain.throbbing = false;
    }

    if (!this.selectedAssessment.painOnSet.sudden) {
      this.selectedAssessment.painOnSet.sudden = false;
    }

    if (!this.selectedAssessment.painOnSet.gradual) {
      this.selectedAssessment.painOnSet.gradual = false;
    }
  }
  getFormatDate(date: dayjs.Dayjs) {
    if (date) {
      // return this.datePipe.transform(date, 'medium');
      return date.format();
    }
    return '';
  }
  onSelectPlan(plan: Plan) {
    this.selectedPlan = plan;
    this.goToTreatmentViewEmitter.emit(this.selectedPlan);
  }
  deleteRow(plan: Plan) {
    if (this.editMode) {
      this.selectedPlan = plan;
      this.deleteSelectedPlan = true;
    }
  }

  cancelDeletePlan() {
    this.deleteSelectedPlan = false;
  }

  afterDeleteTreatment(plan: Plan) {
    if (this.selectedAssessment && this.selectedAssessment.plans) {
      const filters = this.selectedAssessment.plans.filter(item => item.id !== plan.id);
      this.selectedAssessment.plans = filters;
      this.assessmentEventType = AssessmentEventType.ASSESSMENT_VIEW;
    }
    this.deleteSelectedPlan = false;
  }

  goToSoapNote(plan: Plan) {
    this.deleteSelectedPlan = false;
    this.confirmDeleteTreatmentEmitter.emit(plan);
  }
}
