import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Prog } from '../prog.model';
import { ProgService } from '../service/prog.service';
import { ProgFormService, ProgFormGroup } from './prog-form.service';

@Component({
  standalone: true,
  selector: 'jhi-prog-update',
  templateUrl: './prog-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProgUpdateComponent implements OnInit {
  isSaving = false;
  prog: Prog | null = null;

  editForm: ProgFormGroup = this.progFormService.createProgFormGroup();

  constructor(
    protected progService: ProgService,
    protected progFormService: ProgFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prog }) => {
      this.prog = prog;
      if (prog) {
        this.updateForm(prog);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const prog = this.progFormService.getProg(this.editForm);
    if (prog.id !== null) {
      this.subscribeToSaveResponse(this.progService.update(prog));
    } else {
      this.subscribeToSaveResponse(this.progService.create(prog));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Prog>>): void {
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

  protected updateForm(prog: Prog): void {
    this.prog = prog;
    this.progFormService.resetForm(this.editForm, prog);
  }
}
