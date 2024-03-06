import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Province } from '../province.model';
import { ProvinceService } from '../service/province.service';
import { ProvinceFormService, ProvinceFormGroup } from './province-form.service';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';

@Component({
  standalone: true,
  selector: 'jhi-province-update',
  templateUrl: './province-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, AlertErrorComponent],
})
export class ProvinceUpdateComponent implements OnInit {
  isSaving = false;
  province: Province | null = null;

  editForm: ProvinceFormGroup = this.provinceFormService.createProvinceFormGroup();

  constructor(
    protected provinceService: ProvinceService,
    protected provinceFormService: ProvinceFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ province }) => {
      this.province = province;
      if (province) {
        this.updateForm(province);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const province = this.provinceFormService.getProvince(this.editForm);
    if (province.id !== null) {
      this.subscribeToSaveResponse(this.provinceService.update(province));
    } else {
      this.subscribeToSaveResponse(this.provinceService.create(province));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Province>>): void {
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

  protected updateForm(province: Province): void {
    this.province = province;
    this.provinceFormService.resetForm(this.editForm, province);
  }
}
