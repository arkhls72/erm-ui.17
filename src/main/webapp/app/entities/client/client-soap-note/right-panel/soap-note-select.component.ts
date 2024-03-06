import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { SoapNote } from 'app/entities/soap-note/soap-note.model';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { SoapNoteService } from '../../../soap-note/service/soap-note.service';
import { AssessmentService } from '../../../assessment/service/assessment.service';
import { DATE_TIME_FORMAT } from '../../../../config/input.constants';
import dayjs from 'dayjs/esm';
import { AssessmentDeleteComponent } from '../../client-assessment/right-panel/assessment-delete.component';

@Component({
  standalone: true,
  selector: 'bc-soap-note-select',
  templateUrl: './soap-note-select.component.html',
  imports: [ReactiveFormsModule, AssessmentDeleteComponent, NgIf, NgForOf],
})
export class SoapNoteSelectComponent implements OnInit {
  @Input()
  selectedSoapNote!: SoapNote;

  @Output()
  assessmentEmitter = new EventEmitter<Assessment>();

  @Output()
  deleteAssessmentEmitter = new EventEmitter<Assessment>();

  @Output()
  updateSoapNoteEmitter = new EventEmitter();

  editMode = false;
  isAssessmentDelete = false;
  assessments!: Assessment[];
  selectedAssessment!: Assessment;
  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    subjective: [null, [Validators.required, Validators.maxLength(500)]],
    objective: [null, [Validators.required, Validators.maxLength(500)]],
    analysis: [null, [Validators.maxLength(500)]],
    evaluation: [null, [Validators.maxLength(500)]],
    intervention: [],
    clientId: [null, [Validators.required]],
    createdBy: [],
    createdDate: [],
    lastModifiedBy: [],
    lastModifiedDate: [],
  });

  constructor(
    protected soapNoteService: SoapNoteService,
    protected assessmentService: AssessmentService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    if (this.selectedSoapNote) {
      if (this.selectedSoapNote.assessments) {
        this.assessments = this.selectedSoapNote.assessments;
      }
      this.updateForm(this.selectedSoapNote);
    }
  }

  // this is the startup method to init the page
  initSelectedSoapNoteFromParent(soapNote: SoapNote) {
    this.selectedSoapNote = soapNote;
    if (this.selectedSoapNote) {
      const clientId: any = this.selectedSoapNote.clientId;
      this.assessmentService.findShortByClientBySoapNote(clientId, this.selectedSoapNote.id).subscribe(res => {
        if (res.body) {
          this.assessments = res.body;
          this.selectedSoapNote.assessments = this.assessments;
        }
      });
      this.updateForm(this.selectedSoapNote);
    }
  }
  updateForm(soapnote: any): void {
    this.editForm.patchValue({
      id: soapnote.id,
      name: soapnote.name,
      subjective: soapnote.subjective,
      objective: soapnote.objective,
      analysis: soapnote.analysis,
      evaluation: soapnote.evaluation,
      intervention: soapnote.intervention,
      clientId: soapnote.clientId,
      createdBy: soapnote.createdBy,
      createdDate: soapnote.createdDate ? soapnote.createdDate.format(DATE_TIME_FORMAT) : null,
      lastModifiedBy: soapnote.lastModifiedBy,
      lastModifiedDate: soapnote.lastModifiedDate ? soapnote.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    const soapnote = this.createFromForm();
    if (soapnote.id !== undefined) {
      this.subscribeToSaveResponse(this.soapNoteService.update(soapnote));
    } else {
      this.subscribeToSaveResponse(this.soapNoteService.create(soapnote));
    }
  }

  private createFromForm(): SoapNote {
    return {
      ...new SoapNote(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      subjective: this.editForm.get(['subjective'])!.value,
      objective: this.editForm.get(['objective'])!.value,
      analysis: this.editForm.get(['analysis'])!.value,
      evaluation: this.editForm.get(['evaluation'])!.value,
      intervention: this.editForm.get(['intervention'])!.value,
      clientId: this.editForm.get(['clientId'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? dayjs(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      lastModifiedBy: this.editForm.get(['lastModifiedBy'])!.value,
      lastModifiedDate: this.editForm.get(['lastModifiedDate'])!.value
        ? dayjs(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<SoapNote>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body));
  }

  protected onSaveSuccess(result: SoapNote | null): void {
    if (result) {
      this.selectedSoapNote = result;
      this.updateSoapNoteEmitter.emit();
    }
  }

  getFormatDate() {
    if (this.selectedSoapNote && this.selectedSoapNote.lastModifiedDate) {
      const x: any = this.selectedSoapNote.clientId;
      return this.datePipe.transform(x, 'medium');
    }
    return '';
  }
  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    this.editMode = target.checked ? true : false;
    return this.editMode;
  }
  onSelectAssessment(assessment: Assessment) {
    if (assessment && assessment.id) {
      this.assessmentService.find(assessment.id).subscribe(res => {
        if (res.body) {
          assessment = res.body;
          this.assessmentEmitter.emit(assessment);
        }
      });
    }
  }

  deleteAssessment(assessment: Assessment) {
    this.isAssessmentDelete = true;
    this.selectedAssessment = assessment;
  }
  cancelDeleteAssessment() {
    this.isAssessmentDelete = false;
  }
  confirmDeleteAssessment(assessment: Assessment) {
    this.isAssessmentDelete = false;
    const x = this.selectedSoapNote.assessments;
    if (x && x.length > 0) {
      const filtered = x.filter(item => item.id !== assessment.id);
      this.selectedSoapNote.assessments = filtered;
      this.assessments = filtered;
    }
  }
}
