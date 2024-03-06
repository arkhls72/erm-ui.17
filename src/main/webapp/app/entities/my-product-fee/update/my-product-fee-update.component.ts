import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MyProductFee } from '../my-product-fee.model';
import { MyProductFeeService } from '../service/my-product-fee.service';
import { MyProductFeeFormService, MyProductFeeFormGroup } from './my-product-fee-form.service';

@Component({
  standalone: true,
  selector: 'jhi-my-product-fee-update',
  templateUrl: './my-product-fee-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MyProductFeeUpdateComponent implements OnInit {
  isSaving = false;
  myProductFee: MyProductFee | null = null;

  editForm: MyProductFeeFormGroup = this.myProductFeeFormService.createMyProductFeeFormGroup();

  constructor(
    protected myProductFeeService: MyProductFeeService,
    protected myProductFeeFormService: MyProductFeeFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ myProductFee }) => {
      this.myProductFee = myProductFee;
      if (myProductFee) {
        this.updateForm(myProductFee);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const myProductFee = this.myProductFeeFormService.getMyProductFee(this.editForm);
    if (myProductFee.id !== null) {
      this.subscribeToSaveResponse(this.myProductFeeService.update(myProductFee));
    } else {
      this.subscribeToSaveResponse(this.myProductFeeService.create(myProductFee));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<MyProductFee>>): void {
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

  protected updateForm(myProductFee: MyProductFee): void {
    this.myProductFee = myProductFee;
    this.myProductFeeFormService.resetForm(this.editForm, myProductFee);
  }
}
