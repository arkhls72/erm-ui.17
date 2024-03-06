import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PlanNote } from '../plan-note.model';
import { PlanNoteService } from '../service/plan-note.service';
import { PlanNoteFormService, PlanNoteFormGroup } from './plan-note-form.service';

@Component({
  standalone: true,
  selector: 'jhi-plan-note-update',
  templateUrl: './plan-note-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PlanNoteUpdateComponent implements OnInit {
  isSaving = false;
  planNote: PlanNote | null = null;

  editForm: PlanNoteFormGroup = this.planNoteFormService.createPlanNoteFormGroup();

  constructor(
    protected planNoteService: PlanNoteService,
    protected planNoteFormService: PlanNoteFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ planNote }) => {
      this.planNote = planNote;
      if (planNote) {
        this.updateForm(planNote);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const planNote = <PlanNote>this.planNoteFormService.getPlanNote(this.editForm);
    if (planNote.id !== null) {
      this.subscribeToSaveResponse(this.planNoteService.update(planNote));
    } else {
      this.subscribeToSaveResponse(this.planNoteService.create(planNote));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<PlanNote>>): void {
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

  protected updateForm(planNote: PlanNote): void {
    this.planNote = planNote;
    this.planNoteFormService.resetForm(this.editForm, planNote);
  }
}
