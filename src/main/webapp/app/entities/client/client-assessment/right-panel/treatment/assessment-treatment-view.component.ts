import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { TreatmentEventType } from 'app/entities/local-share/treatmentEvent';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { Plan } from 'app/entities/plan/plan.model';
import { TreatmentEventService } from 'app/entities/local-share/treatment-event.service';
import { HttpResponse } from '@angular/common/http';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { PlanNote } from 'app/entities/plan-note/plan-note.model';
import { LocalStorageTreatment } from 'app/entities/local-share/cache/local-storage.treatment';
import { PlanService } from '../../../../plan/service/plan.service';
import { PlanNoteService } from '../../../../plan-note/service/plan-note.service';
import { FormsModule } from '@angular/forms';
import { TreatmentNoteDeleteComponent } from './treatment-note-delete.comonent';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
@Component({
  standalone: true,
  selector: 'bc-assessment-treatment-view',
  templateUrl: './assessment-treatment-view.component.html',
  imports: [FormsModule, TreatmentNoteDeleteComponent, FaIconComponent, NgbInputDatepicker, NgForOf, NgIf],
})
export class AssessmentTreatmentViewComponent implements OnInit {
  editMode = false;

  // when note is select to delete
  deleteSelectedNote = false;

  // when new value entered in clinical note textarea
  isClinicalNoteChanged = false;

  selectedNote!: PlanNote;

  @Input()
  plan!: Plan;

  planNotes!: PlanNote[] | null;

  @Input()
  assessment: Assessment = {} as Assessment;

  @Output()
  deleteTreatmentEmitter = new EventEmitter<Plan>();

  @Output()
  backToAssessmentSelectEmitter = new EventEmitter<Plan>();

  statuses!: string[];
  isSaving = false;
  currentAccount: any;
  startDateDp: any;
  endDateDp: any;
  treatmentEventType: TreatmentEventType = TreatmentEventType.TREATMENT_ADD;
  constructor(
    public eventService: TreatmentEventService,
    private planService: PlanService,
    private planNoteService: PlanNoteService,
    private cache: LocalStorageTreatment,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {
    this.cache.cleanUpLocalStorage();
    if (this.plan && this.plan.id) {
      this.planNoteService.findByPlanId(this.plan.id).subscribe(res => {
        this.planNotes = res.body;
        if (this.planNotes && this.planNotes.length > 0) {
          this.plan.clinicalNote = this.planNotes[0];
          const note = this.planNotes[0];
          this.cache.addCurrentNote(note);
        } else {
          this.plan.clinicalNote = {} as PlanNote;
        }
      });
    }
    this.isSaving = false;
    this.initListBox();
  }

  loadIt() {
    if (this.plan && this.plan.id) {
      this.planService.find(this.plan.id).subscribe(res => {
        const x: any = res.body;
        x.assessmentId = this.assessment.id;
        this.plan = x;
      });
    }
  }

  clear() {
    this.treatmentEventType = TreatmentEventType.BACK;
  }
  save() {
    this.plan.assessmentId = this.assessment.id;
    this.subscribeToSaveResponse(this.planService.update(this.plan));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Plan>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res.body),
      err => this.onSaveError(err),
    );
  }
  private onSaveSuccess(result: any) {
    this.isSaving = false;
    this.plan = result;
    const cacheNote = this.cache.getCurrentNote();

    if (cacheNote) {
      this.plan.clinicalNote = cacheNote;
    } else if (this.planNotes && this.planNotes.length > 0) {
      this.plan.clinicalNote = this.planNotes[0];
    }

    this.loadIt();
  }

  private onSaveError(err: Error) {
    this.isSaving = false;
  }

  ngOnAssessment() {
    this.treatmentEventType = TreatmentEventType.BACK;
  }

  changeStatus(p: Plan, e: Event) {
    const plan: any = p;
    plan.status = this.findElementStringValue(e);
    this.plan = plan;
    this.isSaving = true;
  }

  private findElementStringValue(e: Event) {
    return (e.target as HTMLInputElement).value;
  }

  initListBox() {
    this.statuses = [];
    this.statuses.push('Open');
    this.statuses.push('InProgress');
    this.statuses.push('Close');
  }
  deleteTreatment() {
    this.deleteTreatmentEmitter.emit(this.plan);
  }
  changeForms() {
    this.isSaving = true;
  }
  backToSelectedAssessment() {
    this.backToAssessmentSelectEmitter.emit(this.plan);
  }
  getFormatDate(plan: Plan) {
    if (plan && plan.lastModifiedDate) {
      return this.datePipe.transform(plan.lastModifiedDate.format("'YYYY-MM-DD HH:mm"));
    }
    return '';
  }
  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!this.editMode) {
      this.plan.clinicalNote = this.cache.getCurrentNote();
    }
    return this.editMode;
  }
  onSelectNote(planNote: PlanNote) {
    this.plan.clinicalNote = planNote;
  }

  deleteNote(planNote: PlanNote) {
    this.selectedNote = planNote;
    this.deleteSelectedNote = true;
  }

  addRow() {
    if (this.planNotes && this.planNotes.length > 0) {
      this.plan.clinicalNote = {} as PlanNote;
    }
    return false;
  }

  saveNotes() {
    const planNote = this.plan.clinicalNote;
    if (planNote) {
      planNote.planId = this.plan.id;
      if (planNote.id) {
        this.subscribeToSaveNoteResponse(this.planNoteService.update(planNote));
      } else {
        this.subscribeToSaveNoteResponse(this.planNoteService.create(planNote));
      }
    }
  }
  protected subscribeToSaveNoteResponse(resp: Observable<HttpResponse<PlanNote>>): void {
    resp.subscribe(res => this.onSaveNoteSuccess(res.body));
  }
  private onSaveNoteSuccess(result: PlanNote | null) {
    if (!this.planNotes) {
      this.planNotes = [];
    }
    if (result) {
      const found = this.planNotes.find(i => i.id === result.id);
      if (!found) {
        this.planNotes.unshift(result);
      } else {
        const filtered = this.planNotes.filter(i => i.id !== result.id);
        this.planNotes = filtered;
        this.planNotes.unshift(result);
      }
    }
    // update cache once the new is created. it is the last one onn the list
    this.plan.clinicalNote = result!;
    this.cache.cleanUpLocalStorage();
    this.cache.addCurrentNote(this.plan.clinicalNote);
    this.isClinicalNoteChanged = false;
  }
  cancelNoteDelete() {
    this.deleteSelectedNote = false;
  }
  confirmDeleteNote(planNote: PlanNote) {
    if (this.planNotes && this.planNotes.length > 0) {
      const filtered = this.planNotes?.filter(item => item.id !== planNote.id);
      this.planNotes = filtered;

      if (!filtered || filtered.length === 0) {
        this.plan.clinicalNote!.note = '';
      }
    } else {
      this.plan.clinicalNote!.note = '';
    }
    if (planNote.note === this.plan.clinicalNote!.note) {
      if (this.planNotes && this.planNotes.length > 0) {
        this.plan.clinicalNote = this.planNotes[0];
      }
    }
    this.cache.cleanUpLocalStorage();
    const clinicalPlanNote: any = this.plan.clinicalNote;
    this.cache.addCurrentNote(clinicalPlanNote);
    this.deleteSelectedNote = false;
  }

  isNoteModified(note: string) {
    const cacheNote = this.cache.getCurrentNote();
    if (!cacheNote) {
      this.plan.clinicalNote = {} as PlanNote;
      this.plan.clinicalNote.note = note;
      this.isClinicalNoteChanged = true;
      return true;
    }

    if (cacheNote.note === note) {
      this.isClinicalNoteChanged = false;
      return false;
    }

    if (cacheNote.note !== note) {
      this.isClinicalNoteChanged = true;
      this.plan.clinicalNote!.note = note;
      return true;
    }

    return false;
  }
  cancelNote() {
    this.plan.clinicalNote = this.cache.getCurrentNote();
    this.isClinicalNoteChanged = false;
  }
}
