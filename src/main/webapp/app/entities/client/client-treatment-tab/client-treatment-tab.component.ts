import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Client } from '../client.model';
import { Plan } from 'app/entities/plan/plan.model';
import { TreatmentEventType } from 'app/entities/local-share/treatmentEvent';
import { TreatmentEventService } from 'app/entities/local-share/treatment-event.service';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { TreatmentListComponent } from 'app/entities/client/client-treatment-tab/left-panel/treatment-list.component';
import { TreatmentSelectComponent } from 'app/entities/client/client-treatment-tab/right-panel/treatment-select.component';
import { TreatmentSelectAssessmentComponent } from 'app/entities/client/client-treatment-tab/right-panel/treatment-select-assessment.component';
import { PlanNote } from 'app/entities/plan-note/plan-note.model';
import { TreatmentAddComponent } from 'app/entities/client/client-treatment-tab/right-panel/treatment-add.component';
import { PlanService } from '../../plan/service/plan.service';
import { TreatmentDeleteComponent } from './right-panel/treatment-delete.component';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-client-treatment-tab',
  templateUrl: './client-treatment-tab.component.html',
  imports: [
    TreatmentListComponent,
    TreatmentSelectComponent,
    TreatmentSelectAssessmentComponent,
    TreatmentAddComponent,
    TreatmentDeleteComponent,
    NgIf,
  ],
})
export class ClientTreatmentTabComponent implements OnInit {
  @ViewChild(TreatmentListComponent) childTreatmentList!: TreatmentListComponent;
  @ViewChild(TreatmentSelectComponent) childTreatmentView!: TreatmentSelectComponent;
  @ViewChild(TreatmentAddComponent) childCreateTreatment!: TreatmentAddComponent;

  @ViewChild(TreatmentSelectAssessmentComponent) childTreatmentSelectedAssessment!: TreatmentSelectAssessmentComponent;
  @Input()
  client!: Client;
  isAssessmentSelected = false;
  assessment!: Assessment;

  selectedAssessment!: Assessment;
  selectedPlan!: Plan;
  treatmentPlans!: Plan[];
  treatmentEventType: TreatmentEventType = TreatmentEventType.TREATMENT_VIEW;
  eventSubscription!: Subscription;
  topClinicalNote!: PlanNote;

  constructor(
    private planService: PlanService,
    private route: ActivatedRoute,
    private treatmentEventService: TreatmentEventService,
  ) {
    this.treatmentEventType = TreatmentEventType.TREATMENT_VIEW;
  }

  ngOnInit() {}

  previousState() {
    window.history.back();
  }

  initNotes(plan: Plan) {
    this.topClinicalNote = plan.clinicalNote ? plan.clinicalNote : ({} as PlanNote);
  }
  ngOnHomeExerciseEdit() {
    return true;
  }
  ngOnClinicalDetails() {
    this.treatmentEventType = TreatmentEventType.TREATMENT_LIST;
    // this.load(client.id);
  }

  initTreatmentPlan(plan: Plan) {
    this.selectedPlan = plan;
    if (plan.assessment) {
      this.selectedAssessment = plan.assessment;
    }
    if (!plan.clinicalNote) {
      plan.clinicalNote = {} as PlanNote;
      plan.clinicalNote.note = '';
    }

    this.childTreatmentView.initFromParent(this.selectedPlan);
    this.treatmentEventType = TreatmentEventType.TREATMENT_VIEW;
  }

  initAssessmentClinical(assessment?: Assessment) {
    this.assessment = assessment!;
  }

  ngOnDeletePlan() {
    this.treatmentEventType = TreatmentEventType.TREATMENT_DELETE;
  }

  cancelDelete() {
    this.treatmentEventType = TreatmentEventType.TREATMENT_VIEW;
  }

  confirmAddOrDelete() {
    this.isAssessmentSelected = false;
    this.treatmentEventType = TreatmentEventType.TREATMENT_VIEW;
    this.childTreatmentList.loadFromParent();
  }

  addNewTreatment() {
    this.treatmentEventType = TreatmentEventType.TREATMENT_SELECT_ASSESSMENT;
    this.selectedPlan = {} as Plan;
    this.selectedPlan.clientId = this.client.id;
  }

  cancelAddTreatment() {
    this.treatmentEventType = TreatmentEventType.TREATMENT_VIEW;
    this.selectedAssessment = {} as Assessment;
    this.isAssessmentSelected = false;
    this.childTreatmentList.ngOnInit();
  }
  afterSelectAssessment() {
    this.treatmentEventType = TreatmentEventType.TREATMENT_ADD;
    this.isAssessmentSelected = true;
    if (this.childCreateTreatment) {
      this.childCreateTreatment.initAssessmentFromParent(this.selectedAssessment);
    }
  }
  saveNewTreatment(assessment?: Assessment) {
    if (assessment) {
      this.assessment = assessment;
    }
    this.treatmentEventType = TreatmentEventType.TREATMENT_ADD;
    this.isAssessmentSelected = true;
  }
  gotoCreateTreatment() {
    this.treatmentEventType = TreatmentEventType.TREATMENT_ADD;
  }
  // add new treatment in wizard: first select assessmemt  then step 2 go to create treatment
  goWithSelectAssessment(assessment?: Assessment) {
    if (assessment) {
      this.selectedAssessment = assessment;
    }

    this.treatmentEventType = TreatmentEventType.TREATMENT_SELECT_ASSESSMENT;
  }
  goSelectAssessment() {
    this.isAssessmentSelected = false;
    this.treatmentEventType = TreatmentEventType.TREATMENT_SELECT_ASSESSMENT;
  }
  isSelectedAssessment(assessment: Assessment) {
    if (assessment) {
      this.selectedAssessment = assessment;
      this.isAssessmentSelected = true;
    }
  }

  deletePLan(plan: Plan) {
    this.selectedPlan = plan;
    this.treatmentEventType = TreatmentEventType.TREATMENT_DELETE;
  }
  closeAddTreatment() {
    if (this.treatmentEventType === TreatmentEventType.TREATMENT_ADD) {
      this.treatmentEventType = TreatmentEventType.TREATMENT_SELECT_ASSESSMENT;
    } else {
      this.treatmentEventType = TreatmentEventType.TREATMENT_VIEW;
    }
  }
}
