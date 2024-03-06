import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BodyPart } from '../body-part.model';
import { BodyPartService } from '../service/body-part.service';
import { BodyPartFormService, BodyPartFormGroup } from './body-part-form.service';

@Component({
  standalone: true,
  selector: 'jhi-body-part-update',
  templateUrl: './body-part-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BodyPartUpdateComponent implements OnInit {
  isSaving = false;
  bodyPart: BodyPart | null = null;

  editForm: BodyPartFormGroup = this.bodyPartFormService.createBodyPartFormGroup();

  constructor(
    protected bodyPartService: BodyPartService,
    protected bodyPartFormService: BodyPartFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bodyPart }) => {
      this.bodyPart = bodyPart;
      if (bodyPart) {
        this.updateForm(bodyPart);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bodyPart = this.bodyPartFormService.getBodyPart(this.editForm);
    if (bodyPart.id !== null) {
      this.subscribeToSaveResponse(this.bodyPartService.update(bodyPart));
    } else {
      this.subscribeToSaveResponse(this.bodyPartService.create(bodyPart));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<BodyPart>>): void {
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

  protected updateForm(bodyPart: BodyPart): void {
    this.bodyPart = bodyPart;
    this.bodyPartFormService.resetForm(this.editForm, bodyPart);
  }
}
