import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MyService } from '../my-service.model';
import { MyServiceService } from '../service/my-service.service';
import { MyServiceFormService, MyServiceFormGroup } from './my-service-form.service';

@Component({
  standalone: true,
  selector: 'jhi-my-service-update',
  templateUrl: './my-service-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MyServiceUpdateComponent implements OnInit {
  isSaving = false;
  myService: MyService | null = null;

  editForm: MyServiceFormGroup = this.myServiceFormService.createMyServiceFormGroup();

  constructor(
    protected myServiceService: MyServiceService,
    protected myServiceFormService: MyServiceFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ myService }) => {
      this.myService = myService;
      if (myService) {
        this.updateForm(myService);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const myService = <MyService>this.myServiceFormService.getMyService(this.editForm);
    if (myService.id !== null) {
      this.subscribeToSaveResponse(this.myServiceService.update(myService));
    } else {
      this.subscribeToSaveResponse(this.myServiceService.create(myService));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<MyService>>): void {
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

  protected updateForm(myService: MyService): void {
    this.myService = myService;
    this.myServiceFormService.resetForm(this.editForm, myService);
  }
}
