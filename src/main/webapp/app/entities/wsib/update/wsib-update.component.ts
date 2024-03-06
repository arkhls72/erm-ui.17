import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Wsib } from '../wsib.model';
import { WsibService } from '../service/wsib.service';
import { WsibFormService, WsibFormGroup } from './wsib-form.service';

@Component({
  standalone: true,
  selector: 'jhi-wsib-update',
  templateUrl: './wsib-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class WsibUpdateComponent implements OnInit {
  isSaving = false;
  wsib: Wsib | null = null;

  editForm: WsibFormGroup = this.wsibFormService.createWsibFormGroup();

  constructor(
    protected wsibService: WsibService,
    protected wsibFormService: WsibFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ wsib }) => {
      this.wsib = wsib;
      if (wsib) {
        this.updateForm(wsib);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const wsib = this.wsibFormService.getWsib(this.editForm);
    if (wsib.id !== null) {
      this.subscribeToSaveResponse(this.wsibService.update(wsib));
    } else {
      this.subscribeToSaveResponse(this.wsibService.create(wsib));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Wsib>>): void {
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

  protected updateForm(wsib: Wsib): void {
    this.wsib = wsib;
    this.wsibFormService.resetForm(this.editForm, wsib);
  }
}
