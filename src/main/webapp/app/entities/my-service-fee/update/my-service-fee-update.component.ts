import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MyServiceFee } from '../my-service-fee.model';
import { MyServiceFeeService } from '../service/my-service-fee.service';
import { MyServiceFeeFormService, MyServiceFeeFormGroup } from './my-service-fee-form.service';

@Component({
  standalone: true,
  selector: 'jhi-my-service-fee-update',
  templateUrl: './my-service-fee-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MyServiceFeeUpdateComponent implements OnInit {
  isSaving = false;
  myServiceFee: MyServiceFee | null = null;

  editForm: MyServiceFeeFormGroup = this.myServiceFeeFormService.createMyServiceFeeFormGroup();

  constructor(
    protected myServiceFeeService: MyServiceFeeService,
    protected myServiceFeeFormService: MyServiceFeeFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ myServiceFee }) => {
      this.myServiceFee = myServiceFee;
      if (myServiceFee) {
        this.updateForm(myServiceFee);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const myServiceFee = this.myServiceFeeFormService.getMyServiceFee(this.editForm);
    if (myServiceFee.id !== null) {
      this.subscribeToSaveResponse(this.myServiceFeeService.update(myServiceFee));
    } else {
      this.subscribeToSaveResponse(this.myServiceFeeService.create(myServiceFee));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<MyServiceFee>>): void {
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

  protected updateForm(myServiceFee: MyServiceFee): void {
    this.myServiceFee = myServiceFee;
    this.myServiceFeeFormService.resetForm(this.editForm, myServiceFee);
  }
}
