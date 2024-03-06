import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Injury } from '../injury.model';
import { InjuryService } from '../service/injury.service';
import { InjuryFormService, InjuryFormGroup } from './injury-form.service';

@Component({
  standalone: true,
  selector: 'jhi-injury-update',
  templateUrl: './injury-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InjuryUpdateComponent implements OnInit {
  isSaving = false;
  injury: Injury | null = null;

  editForm: InjuryFormGroup = this.injuryFormService.createInjuryFormGroup();

  constructor(
    protected injuryService: InjuryService,
    protected injuryFormService: InjuryFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ injury }) => {
      this.injury = injury;
      if (injury) {
        this.updateForm(injury);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const injury = this.injuryFormService.getInjury(this.editForm);
    if (injury.id !== null) {
      this.subscribeToSaveResponse(this.injuryService.update(injury));
    } else {
      this.subscribeToSaveResponse(this.injuryService.create(injury));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Injury>>): void {
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

  protected updateForm(injury: Injury): void {
    this.injury = injury;
    this.injuryFormService.resetForm(this.editForm, injury);
  }
}
