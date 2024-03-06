import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ServiceType } from '../service-type.model';
import { ServiceTypeService } from '../service/service-type.service';
import { ServiceTypeFormService, ServiceTypeFormGroup } from './service-type-form.service';

@Component({
  standalone: true,
  selector: 'jhi-service-type-update',
  templateUrl: './service-type-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ServiceTypeUpdateComponent implements OnInit {
  isSaving = false;
  serviceType: ServiceType | null = null;

  editForm: ServiceTypeFormGroup = this.serviceTypeFormService.createServiceTypeFormGroup();

  constructor(
    protected serviceTypeService: ServiceTypeService,
    protected serviceTypeFormService: ServiceTypeFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceType }) => {
      this.serviceType = serviceType;
      if (serviceType) {
        this.updateForm(serviceType);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const serviceType = this.serviceTypeFormService.getServiceType(this.editForm);
    if (serviceType.id !== null) {
      this.subscribeToSaveResponse(this.serviceTypeService.update(serviceType));
    } else {
      this.subscribeToSaveResponse(this.serviceTypeService.create(serviceType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ServiceType>>): void {
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

  protected updateForm(serviceType: ServiceType): void {
    this.serviceType = serviceType;
    this.serviceTypeFormService.resetForm(this.editForm, serviceType);
  }
}
