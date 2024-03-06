import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { AssessmentEventType } from 'app/entities/local-share/assessmentEvent';
import { AssessmentEventService } from 'app/entities/local-share/assessment-event.service';
import { HttpResponse } from '@angular/common/http';
import { Client } from 'app/entities/client/client.model';
import { AggravationPain } from 'app/entities/assessment/aggravationPain.model';
import { SoapNote } from 'app/entities/soap-note/soap-note.model';
import { LocalStorageNavigate } from 'app/entities/local-share/cache/local-storage.navigate';
import { ClientTabNavigateType } from 'app/entities/local-share/clientTabNavigate';
import { AssessmentService } from '../../../assessment/service/assessment.service';
import { PainOnset } from '../../../painOnset.model';
import { FormsModule } from '@angular/forms';
import { AssessmentSaveEntity } from '../../../assessment/assessment-save-entity.model';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-assessment-add',
  templateUrl: './assessment-add.component.html',
  imports: [FormsModule, NgIf],
})
export class AssessmentAddComponent implements OnInit {
  assessment: Assessment = {} as Assessment;

  currentAccount: any;
  assessments!: Assessment[];

  @Output()
  addAssessmentEmitter = new EventEmitter<Assessment>();

  @Output()
  addAssessmentFromSoapNoteEmitter = new EventEmitter<Assessment>();

  @Input()
  client!: Client;

  @Input()
  soapNote!: SoapNote;

  assessmentEventType = AssessmentEventType.ASSESSMENT_ADD;
  constructor(
    public assessmentEventService: AssessmentEventService,
    private cache: LocalStorageNavigate,
    private assessmentService: AssessmentService,
  ) {}

  ngOnInit(): void {
    this.initAssessmentAdd();
    this.assessment.soapNote = this.soapNote;
  }

  initAssessmentAdd() {
    this.assessment.clientId = this.client.id;
    this.assessment.soapNote = this.soapNote;
    const ag: AggravationPain = new AggravationPain();
    ag.throbbing = false;
    ag.sharp = false;
    const assessment: any = this.assessment;
    assessment.aggravationPain = ag;
    this.assessment = assessment;

    this.assessment.aggravationPain = ag;
    const onset: PainOnset = {} as PainOnset;
    onset.sudden = false;
    onset.gradual = false;
    assessment.painOnset = onset;
    this.assessment = assessment;
  }
  save() {
    if (this.assessment) {
      this.initRadios();
      const forSave = this.initAssessmentForSave(this.assessment);
      this.subscribeToSaveResponse(this.assessmentService.createForClient(forSave, this.client.id));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Assessment>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body));
  }

  private onSaveSuccess(assessment: Assessment | null) {
    if (assessment) {
      const x: string = this.cache.getClientTab();
      if (x === ClientTabNavigateType.SOAPNOTES.toString()) {
        this.addAssessmentFromSoapNoteEmitter.emit(assessment);
      } else {
        this.addAssessmentEmitter.emit(assessment);
      }
    }
  }

  isSuddenSelected() {
    const assessment: any = this.assessment;
    if (assessment !== undefined && assessment.painOnset !== undefined && assessment.painOnset.sudden === true) {
      return true;
    }
    return false;
  }
  isGradualSelected() {
    const assessment: any = this.assessment;
    if (assessment !== undefined && assessment.painOnset !== undefined && assessment.painOnset.gradual === true) {
      return true;
    }
    return false;
  }
  addOrRemoveOnset(event: Event, t: any) {
    const target = event.target as HTMLInputElement;

    if (!this.assessment) {
      this.assessment = {} as Assessment;
      this.assessment.painOnSet = new PainOnset();
    }
    if (this.assessment && !this.assessment.painOnSet) {
      this.assessment.painOnSet = new PainOnset();
    }
    if (t === 'sudden') {
      if (target.checked) {
        this.assessment.painOnSet!.sudden = true;
      } else {
        this.assessment.painOnSet!.sudden = false;
      }
    }
    if (t === 'gradual') {
      if (target.checked) {
        this.assessment.painOnSet!.gradual = true;
      } else {
        this.assessment.painOnSet!.gradual = false;
      }
    }
  }

  isSharpSelected() {
    const assessment: any = this.assessment;
    if (assessment !== undefined && assessment.aggravationPain !== undefined && assessment.aggravationPain.sharp === true) {
      return true;
    }
    return false;
  }

  isThrobbingSelected() {
    const assessment: any = this.assessment;
    if (assessment !== undefined && assessment.aggravationPain !== undefined && assessment.aggravationPain.throbbing === true) {
      return true;
    }
    return false;
  }

  addOrRemoveAggravation(event: Event, t: any) {
    const target = event.target as HTMLInputElement;
    if (!this.assessment) {
      this.assessment = {} as Assessment;
      this.assessment.aggravationPain = new AggravationPain();
    }
    if (this.assessment && !this.assessment.aggravationPain) {
      this.assessment.aggravationPain = new AggravationPain();
    }

    if (t === 'sharp') {
      if (target.checked) {
        this.assessment.aggravationPain!.sharp = true;
      } else {
        this.assessment.aggravationPain!.sharp = false;
      }
    }
    if (t === 'throbbing') {
      if (target.checked) {
        this.assessment.aggravationPain!.throbbing = true;
      } else {
        this.assessment.aggravationPain!.throbbing = false;
      }
    }
  }
  initRadios() {
    if (!this.assessment.aggravationPain) {
      this.assessment.aggravationPain = new AggravationPain();
    }
    if (!this.assessment.painOnSet) {
      this.assessment.painOnSet = new PainOnset();
    }

    if (!this.assessment.aggravationPain.sharp) {
      this.assessment.aggravationPain.sharp = false;
    }

    if (!this.assessment.aggravationPain.throbbing) {
      this.assessment.aggravationPain.throbbing = false;
    }

    if (!this.assessment.painOnSet.gradual) {
      this.assessment.painOnSet.gradual = false;
    }

    if (!this.assessment.painOnSet.sudden) {
      this.assessment.painOnSet.sudden = false;
    }
  }
  // To avoid cicle reference between assessment and soapNote
  initAssessmentForSave(source: Assessment) {
    const target = {} as AssessmentSaveEntity;
    target.plans = source.plans;
    target.sourcePain = source.sourcePain;
    target.clientId = source.clientId;
    target.soapNote = this.soapNote;
    target.note = source.note;
    target.aggravationPain = source.aggravationPain;
    target.painOnSet = source.painOnSet;
    target.name = source.name;
    target.isBack = source.isBack;
    target.painIntensity = source.painIntensity;
    return target;
  }
}
