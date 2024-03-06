import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Client } from '../client.model';
import { Plan } from 'app/entities/plan/plan.model';
import { SoapNoteEventType } from 'app/entities/local-share/SoapNoteEvent';
import { SoapNote } from 'app/entities/soap-note/soap-note.model';
import { SoapNoteSelectComponent } from 'app/entities/client/client-soap-note/right-panel/soap-note-select.component';
import { SoapNoteListComponent } from 'app/entities/client/client-soap-note/left-panel/soap-note-list.component';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { ClientTabNavigateType } from 'app/entities/local-share/clientTabNavigate';
import { LocalStorageNavigate } from 'app/entities/local-share/cache/local-storage.navigate';
import { SoapNoteAddComponent } from './right-panel/soap-note-add.component';
import { SoapNoteDeleteComponent } from './right-panel/soap-note-delete.component';
import { AssessmentSelectComponent } from '../client-assessment/right-panel/assessment-select.component';
import { AssessmentTreatmentViewComponent } from '../client-assessment/right-panel/treatment/assessment-treatment-view.component';
import { AssessmentTreatmentAddComponent } from '../client-assessment/right-panel/treatment/assessment-treatment-add.component';
import { AssessmentAddComponent } from '../client-assessment/right-panel/assessment-add.component';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-client-soap-note-tab',
  templateUrl: './client-soap-note-tab.component.html',
  imports: [
    SoapNoteListComponent,
    SoapNoteSelectComponent,
    SoapNoteAddComponent,
    SoapNoteDeleteComponent,
    AssessmentSelectComponent,
    AssessmentTreatmentViewComponent,
    AssessmentTreatmentAddComponent,
    AssessmentAddComponent,
    NgIf,
  ],
})
export class ClientSoapNoteTabComponent implements OnInit {
  @ViewChild(SoapNoteListComponent) childSoapNotetList!: SoapNoteListComponent;
  @ViewChild(SoapNoteSelectComponent) childSoapNoteSelect!: SoapNoteSelectComponent;

  @Input()
  client!: Client;
  plan!: Plan;
  selectedSoapNote!: SoapNote;
  soapNoteEventType?: SoapNoteEventType = SoapNoteEventType.SOAP_NOTE_VIEW;
  eventSubscription!: Subscription;
  selectedAssessment!: Assessment;
  constructor(public cache: LocalStorageNavigate) {
    this.cache.cleanUpLocalStorage();
    this.cache.addClientTab(ClientTabNavigateType.SOAPNOTES.toString());
  }

  ngOnInit() {}

  previousState() {
    window.history.back();
  }

  ngOnHomeExerciseEdit() {
    return true;
  }
  ngOnClinicalDetails() {
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_VIEW;
  }

  initSoapNote(soapNote: SoapNote) {
    this.selectedSoapNote = soapNote;
    if (this.childSoapNoteSelect) {
      this.childSoapNoteSelect.initSelectedSoapNoteFromParent(this.selectedSoapNote);
    }
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_VIEW;
  }

  confirmAddDeleteUpdate() {
    this.childSoapNotetList.loadAll();
  }

  addSoapNote() {
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_ADD;
  }

  deletePLan(plan: Plan) {
    this.selectedSoapNote = plan;
    // this.soapNoteEventType = TreatmentEventType.TREATMENT_DELETE;
  }
  backToMain(soapNote: SoapNote) {
    switch (this.soapNoteEventType) {
      case SoapNoteEventType.SOAP_NOTE_TREATMENT_VIEW:
        this.selectedSoapNote = soapNote;
        this.goToAssessmentView();
        break;
      case SoapNoteEventType.SOAP_NOTE_ASSESSMENT_VIEW:
        this.selectedSoapNote = soapNote;
        this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_VIEW;
        this.childSoapNotetList.ngOnClickSoapNote(this.selectedSoapNote);
        break;

      default:
    }
  }

  backToTab() {
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_VIEW;
  }

  goToAssessmentView() {
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_ASSESSMENT_VIEW;
  }
  afterTreatmentPlanDelete(plan: Plan) {
    if (this.selectedAssessment) {
      if (!this.selectedAssessment.plans) {
        this.selectedAssessment.plans = [];
      }
      const plans = this.selectedAssessment.plans.filter(item => item.id !== plan.id);
      this.selectedAssessment.plans = plans;
    }
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_ASSESSMENT_VIEW;
  }

  afterAddSopaNote(sopaNote: SoapNote) {
    this.childSoapNotetList.initFromParentAfterAdd(sopaNote);
    this.selectedSoapNote = sopaNote;
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_VIEW;
  }

  deleteSoapNote(soapNote: SoapNote) {
    this.selectedSoapNote = soapNote;
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_DELETE;
  }
  cancelDeleteSoapNote() {
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_VIEW;
  }
  confirmedDeleteSoapNote(soapNote: SoapNote) {
    this.childSoapNotetList.initFromParentAfterDelete(soapNote);
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_VIEW;
  }

  // load assessment page from client-assessment-tab
  ngOnAssessment(assessment: Assessment) {
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_ASSESSMENT_VIEW;
    this.selectedAssessment = assessment;
  }
  // runs after assessment has been updated from within View Soapnote:view Assessment
  // if it was new assessment will be added otherise updated.
  addUpdateAssessment(assessment: Assessment) {
    const filtered = this.selectedSoapNote.assessments?.filter(item => item.id !== assessment.id);
    this.selectedSoapNote.assessments = [];
    if (filtered) {
      this.selectedSoapNote.assessments = filtered;
    } else {
      this.selectedSoapNote.assessments = [];
    }
    this.selectedSoapNote.assessments.unshift(assessment);
  }

  ngOnDeleteAssessment() {
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_VIEW;
  }

  goToTreatmentView(plan: Plan) {
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_TREATMENT_VIEW;
    this.plan = plan;
  }

  backToAssessmentSelect(assessment: Assessment) {
    this.selectedAssessment = assessment;
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_ASSESSMENT_VIEW;
  }

  deleteTreatment(plan: Plan) {
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_TREATMENT_VIEW;
    this.plan = plan;
  }

  addTreatment() {
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_TREATMENT_ADD;
  }
  addAssessment() {
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_ASSESSMENT_ADD;
  }
  backToTabAfterAssessmentAdd() {
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_VIEW;
    this.childSoapNotetList.loadAll();
  }
  // go back to previous page View Assessment
  cancelAddTreatment() {
    if (this.soapNoteEventType === SoapNoteEventType.SOAP_NOTE_ASSESSMENT_VIEW) {
      this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_VIEW;
    } else {
      this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_ASSESSMENT_VIEW;
    }
  }
  // if treatment added successfully then the list of tearment inside assessment must be updated.
  // we add the new created one to the list of Assessment.treatments
  confirmAddTreatment(treatment: Plan) {
    if (this.selectedAssessment) {
      if (!this.selectedAssessment.plans) {
        this.selectedAssessment.plans = [];
      }
      this.selectedAssessment.plans.push(treatment);
    }
    this.soapNoteEventType = SoapNoteEventType.SOAP_NOTE_ASSESSMENT_VIEW;
  }
}
