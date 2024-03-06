import { ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Client } from '../client.model';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { Plan } from 'app/entities/plan/plan.model';
import { AssessmentEventType } from 'app/entities/local-share/assessmentEvent';
import { AssessmentEventService } from 'app/entities/local-share/assessment-event.service';

import { AssessmentListComponent } from 'app/entities/client/client-assessment/left-panel/assessment-list.component';
import { AssessmentSelectComponent } from 'app/entities/client/client-assessment/right-panel/assessment-select.component';
import { ClientTabNavigateType } from 'app/entities/local-share/clientTabNavigate';
import { LocalStorageNavigate } from 'app/entities/local-share/cache/local-storage.navigate';
import { SoapNote } from 'app/entities/soap-note/soap-note.model';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { AssessmentService } from '../../assessment/service/assessment.service';
import { AssessmentAddComponent } from './right-panel/assessment-add.component';
import { AssessmentDeleteComponent } from './right-panel/assessment-delete.component';
import { AssessmentTreatmentViewComponent } from './right-panel/treatment/assessment-treatment-view.component';
import { AssessmentTreatmentDeleteComponent } from './right-panel/treatment/assessment-treatment-delete.component';
import { AssessmentTreatmentAddComponent } from './right-panel/treatment/assessment-treatment-add.component';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-client-assessment-tab',
  templateUrl: './client-assessment-tab.component.html',
  imports: [
    AssessmentListComponent,
    AssessmentSelectComponent,
    AssessmentAddComponent,
    AssessmentDeleteComponent,
    AssessmentTreatmentViewComponent,
    AssessmentTreatmentDeleteComponent,
    AssessmentTreatmentAddComponent,
    NgIf,
  ],
})
export class ClientAssessmentTabComponent implements OnInit {
  assessmentEventType!: AssessmentEventType;

  selectedSoapNote!: SoapNote | null;
  @Input()
  client!: Client;
  assessments!: Assessment[];

  selectedAssessment!: Assessment;
  currentAccount: any;
  currentSearch: string;
  totalItems: any;
  queryCount: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  routeData: any;
  links: any;
  isSaving!: boolean;
  plan!: Plan;
  eventSubscription!: Subscription;

  @ViewChild(AssessmentListComponent) childAssessmentList!: AssessmentListComponent;
  @ViewChild(AssessmentSelectComponent) childAssessmentSelect!: AssessmentSelectComponent;

  constructor(
    private assessmentEventService: AssessmentEventService,
    private assessmentService: AssessmentService,
    private activatedRoute: ActivatedRoute,
    public zone: NgZone,
    public cache: LocalStorageNavigate,
    private ref: ChangeDetectorRef,
  ) {
    this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 1;
    this.previousPage = 1;
    this.reverse = true;
    this.predicate = 'id';
    // set the tab name to navigate between tabs for
    this.cache.cleanUpLocalStorage();
    this.cache.addClientTab(ClientTabNavigateType.ASSESSMENTS.toString());
  }
  ngOnInit() {
    this.assessmentEventType = AssessmentEventType.ASSESSMENT_VIEW;
  }

  backToTab() {
    this.assessmentEventType = AssessmentEventType.ASSESSMENT_VIEW;
  }

  backToTabAfterAdd(assessment: Assessment) {
    this.assessmentEventType = AssessmentEventType.ASSESSMENT_VIEW;
    this.selectedAssessment = assessment;
    this.childAssessmentList.laodPagefromParent();
  }
  backToTabAfterDelete() {
    this.assessmentEventType = AssessmentEventType.ASSESSMENT_VIEW;
    this.childAssessmentList.ngOnInit();
  }

  ngOnSelectAssessment(assessment: Assessment) {
    this.selectedAssessment = assessment;
    this.selectedSoapNote = assessment.soapNote!;
    this.childAssessmentSelect.initSelectedAssessment(this.selectedAssessment);
  }

  ngOnDeleteAssessment(assessment: Assessment) {
    this.selectedAssessment = assessment;
    this.assessmentEventType = AssessmentEventType.ASSESSMENT_DELETE;
  }

  loadChildFromTab() {
    this.childAssessmentList.laodPagefromParent();
  }
  addAssessment() {
    this.assessmentEventType = AssessmentEventType.ASSESSMENT_ADD;
  }

  deleteTreatment(plan: Plan) {
    this.assessmentEventType = AssessmentEventType.ASSESSMENT_TREATMENT_DELETE;
    this.plan = plan;
  }

  goToTreatmentView(plan: Plan) {
    this.assessmentEventType = AssessmentEventType.ASSESSMENT_TREATMENT_VIEW;
    this.plan = plan;
  }

  backToAssessmentSelect(assessment: Assessment) {
    this.selectedAssessment = assessment;
    this.assessmentEventType = AssessmentEventType.ASSESSMENT_VIEW;
  }

  cancelTreatmentDelete(plan: Plan) {
    this.goToTreatmentView(plan);
  }
  confirmTreatmentDelete(plan: Plan) {
    this.assessmentEventType = AssessmentEventType.ASSESSMENT_VIEW;
    const assessment = this.selectedAssessment;
    const treatmentPlans = assessment.plans;
    if (treatmentPlans) {
      const found = treatmentPlans.filter(p => p.id !== plan.id);
      this.selectedAssessment.plans = found;
    }
  }

  addTreatment() {
    this.assessmentEventType = AssessmentEventType.ASSESSMENT_ADD_TREATMENT;
  }

  // add treatment functionality
  cancelAddTreatment() {}
  confirmAddTreatment(plan: Plan) {
    const array = [];
    if (plan) {
      array.push(plan);
    }

    if (this.selectedAssessment && this.selectedAssessment.plans) {
      this.selectedAssessment.plans.forEach(it => {
        array.push(it);
      });
    }
    this.selectedAssessment.plans = array;
    this.assessmentEventType = AssessmentEventType.ASSESSMENT_VIEW;
  }
  gotoSelectAssessment(assessment: Assessment) {
    this.backToAssessmentSelect(assessment);
  }
  backToAssessmentTab() {
    this.assessmentEventType = AssessmentEventType.ASSESSMENT_VIEW;
    this.childAssessmentList.ngOnInit();
  }

  disableAddTreatment() {
    return !(
      this.assessmentEventType !== AssessmentEventType.ASSESSMENT_ADD &&
      this.assessmentEventType !== AssessmentEventType.ASSESSMENT_ADD_TREATMENT &&
      this.assessmentEventType !== AssessmentEventType.ASSESSMENT_TREATMENT_VIEW &&
      !this.selectedAssessment
    );
  }

  disableBackButton(): boolean {
    return !(
      this.assessmentEventType === AssessmentEventType.ASSESSMENT_ADD ||
      this.assessmentEventType === AssessmentEventType.ASSESSMENT_ADD_TREATMENT ||
      this.assessmentEventType === AssessmentEventType.ASSESSMENT_TREATMENT_VIEW
    );
  }
  getTabId() {
    return ClientTabNavigateType.TREATMENTS;
  }
}
