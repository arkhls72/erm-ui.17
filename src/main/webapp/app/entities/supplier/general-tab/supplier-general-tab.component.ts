import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Supplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from '../service/supplier.service';
import { DATE_TIME_FORMAT } from '../../../config/input.constants';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'bc-supplier-general-tab',
  templateUrl: './supplier-general-tab.component.html',
})
export class SupplierGeneralTabComponent implements OnInit {
  isSaving = false;
  supplier!: Supplier;
  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(25)]],
    contactName: [null, [Validators.required, Validators.maxLength(50)]],
    phone: [null, [Validators.required, Validators.maxLength(12)]],
    addressId: [],
    lastModifiedBy: [],
    lastModifiedDate: [],
  });
  updateForm(input: any): void {
    this.editForm.patchValue({
      id: input.id,
      name: input.name,
      contactName: input.contactName,
      phone: input.phone,
      addressId: input.addressId,
      lastModifiedBy: input.lastModifiedBy,
      lastModifiedDate: input.lastModifiedDate ? input.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
    });
  }

  constructor(
    protected supplierService: SupplierService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ supplier }) => {
      if (!supplier.id) {
        const today = dayjs();
        // const today = moment().startOf('day');
        supplier.lastModifiedDate = today;
      }

      this.supplier = supplier;
      this.updateForm(this.supplier);
    });
  }
  //TODO unsubscribed

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const supplier = this.createFromForm();
    if (supplier.id !== undefined) {
      this.subscribeToSaveResponse(this.supplierService.update(supplier));
    } else {
      this.subscribeToSaveResponse(this.supplierService.create(supplier));
    }
  }

  private createFromForm(): Supplier {
    const updatedDate: any = this.editForm.get(['lastModifiedDate'])!.value
      ? (this.editForm.get(['lastModifiedDate'])!.value as Dayjs).format(DATE_TIME_FORMAT).toString()
      : null;

    return {
      ...new Supplier(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      contactName: this.editForm.get(['contactName'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      addressId: this.editForm.get(['addressId'])!.value,
      lastModifiedBy: this.editForm.get(['lastModifiedBy'])!.value,
      lastModifiedDate: updatedDate,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Supplier>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(res: any): void {
    this.isSaving = false;
    this.supplier = res.body;
    this.updateForm(this.supplier);
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  private getfromInput(input: Supplier) {
    const supplier = {
      id: input.id,
      name: input.name,
      contactName: input.contactName,
      phone: input.phone,
      addressId: input.addressId,
      email: input.email,
      lastModifiedBy: input.lastModifiedBy,
      lastModifiedDate: input.lastModifiedDate,
    };
    return supplier;
  }
}
