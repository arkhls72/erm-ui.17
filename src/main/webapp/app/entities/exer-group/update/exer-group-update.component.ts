import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExerGroup } from '../exer-group.model';
import { ExerGroupService } from '../service/exer-group.service';
import { ExerGroupFormService, ExerGroupFormGroup } from './exer-group-form.service';

@Component({
  standalone: true,
  selector: 'jhi-exer-group-update',
  templateUrl: './exer-group-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ExerGroupUpdateComponent implements OnInit {
  isSaving = false;
  exerGroup: ExerGroup | null = null;

  editForm: ExerGroupFormGroup = this.exerGroupFormService.createExerGroupFormGroup();

  constructor(
    protected exerGroupService: ExerGroupService,
    protected exerGroupFormService: ExerGroupFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exerGroup }) => {
      this.exerGroup = exerGroup;
      if (exerGroup) {
        this.updateForm(exerGroup);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const exerGroup = <ExerGroup>this.exerGroupFormService.getExerGroup(this.editForm);
    if (exerGroup.id !== null) {
      this.subscribeToSaveResponse(this.exerGroupService.update(exerGroup));
    } else {
      this.subscribeToSaveResponse(this.exerGroupService.create(exerGroup));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ExerGroup>>): void {
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

  protected updateForm(exerGroup: ExerGroup): void {
    this.exerGroup = exerGroup;
    this.exerGroupFormService.resetForm(this.editForm, exerGroup);
  }
}
