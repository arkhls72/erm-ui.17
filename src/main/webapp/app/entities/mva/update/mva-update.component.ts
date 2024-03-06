import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Mva } from '../mva.model';
import { MvaService } from '../service/mva.service';
import { MvaFormService, MvaFormGroup } from './mva-form.service';

@Component({
  standalone: true,
  selector: 'jhi-mva-update',
  templateUrl: './mva-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MvaUpdateComponent implements OnInit {
  isSaving = false;
  mva: Mva | null = null;

  editForm: MvaFormGroup = this.mvaFormService.createMvaFormGroup();

  constructor(
    protected mvaService: MvaService,
    protected mvaFormService: MvaFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mva }) => {
      this.mva = mva;
      if (mva) {
        this.updateForm(mva);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mva = this.mvaFormService.getMva(this.editForm);
    if (mva.id !== null) {
      this.subscribeToSaveResponse(this.mvaService.update(mva));
    } else {
      this.subscribeToSaveResponse(this.mvaService.create(mva));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Mva>>): void {
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

  protected updateForm(mva: Mva): void {
    this.mva = mva;
    this.mvaFormService.resetForm(this.editForm, mva);
  }
}
