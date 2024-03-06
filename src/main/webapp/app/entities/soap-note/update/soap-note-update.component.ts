import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SoapNote } from '../soap-note.model';
import { SoapNoteService } from '../service/soap-note.service';
import { SoapNoteFormService, SoapNoteFormGroup } from './soap-note-form.service';

@Component({
  standalone: true,
  selector: 'jhi-soap-note-update',
  templateUrl: './soap-note-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SoapNoteUpdateComponent implements OnInit {
  isSaving = false;
  soapNote: SoapNote | null = null;

  editForm: SoapNoteFormGroup = this.soapNoteFormService.createSoapNoteFormGroup();

  constructor(
    protected soapNoteService: SoapNoteService,
    protected soapNoteFormService: SoapNoteFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ soapNote }) => {
      this.soapNote = soapNote;
      if (soapNote) {
        this.updateForm(soapNote);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const soapNote = this.soapNoteFormService.getSoapNote(this.editForm);
    if (soapNote.id !== null) {
      this.subscribeToSaveResponse(this.soapNoteService.update(soapNote));
    } else {
      this.subscribeToSaveResponse(this.soapNoteService.create(soapNote));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<SoapNote>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(soapNote: SoapNote): void {
    this.soapNote = soapNote;
    this.soapNoteFormService.resetForm(this.editForm, soapNote);
  }
}
