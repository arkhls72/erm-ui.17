import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { TreatmentEventType } from 'app/entities/local-share/treatmentEvent';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { Plan } from 'app/entities/plan/plan.model';
import { TreatmentEventService } from 'app/entities/local-share/treatment-event.service';
import { HttpResponse } from '@angular/common/http';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { LocalStorageTreatment } from 'app/entities/local-share/cache/local-storage.treatment';
import { PlanNote } from 'app/entities/plan-note/plan-note.model';
import { PlanService } from '../../../plan/service/plan.service';
import { PlanNoteService } from '../../../plan-note/service/plan-note.service';
import { TreatmentNoteDeleteComponent } from '../../client-assessment/right-panel/treatment/treatment-note-delete.comonent';
import SharedModule from '../../../../shared/shared.module';
import { SortByDirective, SortDirective } from '../../../../shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../../shared/date';
import { ItemCountComponent } from '../../../../shared/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'bc-treatment-select',
  templateUrl: './treatment-select.component.html',
  imports: [
    TreatmentNoteDeleteComponent,
    TreatmentNoteDeleteComponent,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
    FormsModule,
    NgIf,
    NgForOf,
  ],
})
export class TreatmentSelectComponent implements OnInit {
  editMode = false;

  // when note is select to delete
  deleteSelectedNote = false;

  // when new value entered in clinical note textarea
  isClinicalNoteChanged = false;

  selectedNote!: PlanNote;

  @Input()
  plan: Plan = {} as Plan;

  planNotes!: PlanNote[] | null;

  @Input()
  assessment!: Assessment;
  @Output()
  deleteTreatmentEmitter = new EventEmitter<Plan>();

  @Output()
  backToAssessmentSelectEmitter = new EventEmitter<Plan>();

  statuses!: string[];
  isSaving = false;
  currentAccount: any;
  startDateDp!: any;
  endDateDp!: any;
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
          this.plan.clinicalNote.note = '';
        }
      });
    }
    if (!this.plan) {
      this.plan = {} as Plan;
      this.plan.clinicalNote = {} as PlanNote;
    }
    if (this.plan && !this.plan.clinicalNote) {
      this.plan.clinicalNote = {} as PlanNote;
    }

    if (this.plan.clinicalNote!.note) {
      this.plan.clinicalNote!.note = '';
    }

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
    const plan: Plan = p;
    if (plan) {
      plan.status = this.findElementStringValue(e);
      this.plan = plan;
    }
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
      return this.datePipe.transform(plan.lastModifiedDate.format(''));
    }
    return '';
  }
  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    this.editMode = target.checked ? true : false;
    if (!this.editMode) {
      const cacheValue = this.cache.getCurrentNote();
      if (!cacheValue) {
        this.plan.clinicalNote = {} as PlanNote;
        this.plan.clinicalNote.note = '';
      } else {
        this.plan.clinicalNote = cacheValue;
      }
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
    this.cache.addCurrentNote(this.plan.clinicalNote!);
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
  initFromParent(plan: Plan) {
    this.plan = plan;
    if (this.plan && this.plan.assessment) {
      this.assessment = this.plan.assessment;
    }

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
          this.plan.clinicalNote.note = '';
        }
      });
    }
  }
}
