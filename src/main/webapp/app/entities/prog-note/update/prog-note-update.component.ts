import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProgNote } from '../prog-note.model';
import { ProgNoteService } from '../service/prog-note.service';
import { ProgNoteFormService, ProgNoteFormGroup } from './prog-note-form.service';

@Component({
  standalone: true,
  selector: 'jhi-prog-note-update',
  templateUrl: './prog-note-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProgNoteUpdateComponent implements OnInit {
  isSaving = false;
  progNote: ProgNote | null = null;

  editForm: ProgNoteFormGroup = this.progNoteFormService.createProgNoteFormGroup();

  constructor(
    protected progNoteService: ProgNoteService,
    protected progNoteFormService: ProgNoteFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ progNote }) => {
      this.progNote = progNote;
      if (progNote) {
        this.updateForm(progNote);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const progNote = this.progNoteFormService.getProgNote(this.editForm);
    if (progNote.id !== null) {
      this.subscribeToSaveResponse(this.progNoteService.update(progNote));
    } else {
      this.subscribeToSaveResponse(this.progNoteService.create(progNote));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProgNote>>): void {
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

  protected updateForm(progNote: ProgNote): void {
    this.progNote = progNote;
    this.progNoteFormService.resetForm(this.editForm, progNote);
  }
}
