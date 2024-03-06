import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SoapNote } from 'app/entities/soap-note/soap-note.model';
import { DatePipe, NgIf } from '@angular/common';
import { Client } from 'app/entities/client/client.model';
import { SoapNoteService } from '../../../soap-note/service/soap-note.service';

@Component({
  standalone: true,
  selector: 'bc-soap-note-add',
  templateUrl: './soap-note-add.component.html',
  imports: [ReactiveFormsModule, NgIf],
})
export class SoapNoteAddComponent implements OnInit {
  @Input()
  client!: Client;

  @Output()
  saveEmitter = new EventEmitter<SoapNote>();

  isSaving = false;
  editMode = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    subjective: [null, [Validators.required, Validators.maxLength(500)]],
    objective: [null, [Validators.required, Validators.maxLength(500)]],
    analysis: [null, [Validators.maxLength(500)]],
    evaluation: [null, [Validators.maxLength(500)]],
    intervention: [],
    clientId: [null, [Validators.required]],
  });

  constructor(
    protected soapnoteService: SoapNoteService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {}

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
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const soapnote = this.createFromForm();
    this.subscribeToSaveResponse(this.soapnoteService.create(soapnote));
  }

  private createFromForm(): SoapNote {
    return {
      ...new SoapNote(),
      name: this.editForm.get(['name'])!.value,
      subjective: this.editForm.get(['subjective'])!.value,
      objective: this.editForm.get(['objective'])!.value,
      analysis: this.editForm.get(['analysis'])!.value,
      evaluation: this.editForm.get(['evaluation'])!.value,
      intervention: this.editForm.get(['intervention'])!.value,
      clientId: this.client.id,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<SoapNote>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res.body),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(result: SoapNote | null): void {
    if (result) {
      this.saveEmitter.emit(result);
    }
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  checkEditMode(checked: Boolean) {
    this.editMode = checked ? true : false;
    return this.editMode;
  }
}
