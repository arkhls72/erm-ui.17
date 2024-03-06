import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProgExerGroup } from '../prog-exer-group.model';
import { ProgExerGroupService } from '../service/prog-exer-group.service';
import { ProgExerGroupFormService, ProgExerGroupFormGroup } from './prog-exer-group-form.service';

@Component({
  standalone: true,
  selector: 'jhi-prog-exer-group-update',
  templateUrl: './prog-exer-group-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProgExerGroupUpdateComponent implements OnInit {
  isSaving = false;
  progExerGroup: ProgExerGroup | null = null;

  editForm: ProgExerGroupFormGroup = this.progExerGroupFormService.createProgExerGroupFormGroup();

  constructor(
    protected progExerGroupService: ProgExerGroupService,
    protected progExerGroupFormService: ProgExerGroupFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ progExerGroup }) => {
      this.progExerGroup = progExerGroup;
      if (progExerGroup) {
        this.updateForm(progExerGroup);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const progExerGroup = this.progExerGroupFormService.getProgExerGroup(this.editForm);
    if (progExerGroup.id !== null) {
      this.subscribeToSaveResponse(this.progExerGroupService.update(progExerGroup));
    } else {
      this.subscribeToSaveResponse(this.progExerGroupService.create(progExerGroup));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProgExerGroup>>): void {
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

  protected updateForm(progExerGroup: ProgExerGroup): void {
    this.progExerGroup = progExerGroup;
    this.progExerGroupFormService.resetForm(this.editForm, progExerGroup);
  }
}
