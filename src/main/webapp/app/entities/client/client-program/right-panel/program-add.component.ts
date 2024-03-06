import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Assessment } from 'app/entities/assessment/assessment.model';
import { TreatmentEventType } from 'app/entities/local-share/treatmentEvent';
import { HttpResponse } from '@angular/common/http';
import { Client } from 'app/entities/client/client.model';
import { Prog } from 'app/entities/prog/prog.model';
import { ProgNote } from 'app/entities/prog-note/prog-note.model';
import { ProgService } from '../../../prog/service/prog.service';
import { FormsModule } from '@angular/forms';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
@Component({
  standalone: true,
  selector: 'bc-program-add',
  templateUrl: './program-add.component.html',
  imports: [FormsModule, NgbInputDatepicker, FaIconComponent, NgIf],
})
export class ProgramAddComponent implements OnInit {
  prog: Prog = {} as Prog;

  @Input()
  selectedAssessment!: Assessment;

  @Input()
  client!: Client;

  @Output()
  cancelAddProgramEmitter = new EventEmitter<Prog>();

  @Output()
  confirmedAddProgEmitter = new EventEmitter<Prog>();

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

  constructor(private progService: ProgService) {}

  ngOnInit() {
    this.prog = {} as Prog;
  }
  save() {
    if (!this.prog) {
      this.prog = {} as Prog;
    }
    this.prog.clientId = this.client.id;
    this.prog.assessmentId = this.selectedAssessment.id;

    this.subscribeToSaveResponse(this.progService.create(this.prog));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Prog>>): void {
    result.subscribe(r => this.onSaveSuccess(r));
  }

  private onSaveSuccess(r: HttpResponse<Prog>) {
    if (r && r.body) {
      this.prog = r.body;
      this.confirmedAddProgEmitter.emit(this.prog);
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

  closeAddProgWindow() {
    if (this.selectedAssessment) {
      this.cancelAddProgramEmitter.emit();
    }
  }

  isNoteModified(note: string) {
    if (this.prog && !this.prog.clinicalNote) {
      this.prog.clinicalNote = {} as ProgNote;
    }
    this.prog.clinicalNote!.note = note;
  }

  initAssessmentFromParent(assessment: Assessment) {
    this.selectedAssessment = assessment;
    this.prog = {} as Prog;
  }
}
