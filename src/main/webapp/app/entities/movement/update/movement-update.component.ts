import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Movement } from '../movement.model';
import { MovementService } from '../service/movement.service';
import { MovementFormService, MovementFormGroup } from './movement-form.service';

@Component({
  standalone: true,
  selector: 'jhi-movement-update',
  templateUrl: './movement-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MovementUpdateComponent implements OnInit {
  isSaving = false;
  movement: Movement | null = null;

  editForm: MovementFormGroup = this.movementFormService.createMovementFormGroup();

  constructor(
    protected movementService: MovementService,
    protected movementFormService: MovementFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ movement }) => {
      this.movement = movement;
      if (movement) {
        this.updateForm(movement);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const movement = this.movementFormService.getMovement(this.editForm);
    if (movement.id !== null) {
      this.subscribeToSaveResponse(this.movementService.update(movement));
    } else {
      this.subscribeToSaveResponse(this.movementService.create(movement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Movement>>): void {
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

  protected updateForm(movement: Movement): void {
    this.movement = movement;
    this.movementFormService.resetForm(this.editForm, movement);
  }
}
