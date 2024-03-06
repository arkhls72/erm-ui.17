import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MyServiceFee } from 'app/entities/my-service-fee/my-service-fee.model';
import { MyService } from 'app/entities/my-service/my-service.model';
import { FeeType } from 'app/entities/fee-type/fee-type.model';
import { MyServiceFeeUpdate } from 'app/entities/my-service-fee/my-service-fee-update.model';
import { MyServiceFeeService } from '../../../my-service-fee/service/my-service-fee.service';
import { FeeTypeService } from '../../../fee-type/service/fee-type.service';
import { DATE_TIME_FORMAT } from '../../../../config/input.constants';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'bc-service-fee-tab',
  templateUrl: './service-fee-tab.component.html',
})
export class ServiceFeeTabComponent implements OnInit {
  isSaving = false;
  @Input()
  myService: MyService | null | undefined;

  feeTypes: FeeType[] = [];

  myServiceFees: MyServiceFee[] = [];
  toAddOrUpdateServiceFees: MyServiceFee[] = [];
  toUpdateServiceFees: MyServiceFee[] = [];
  editForm = this.fb.group({
    id: [],
    fee: [null, [Validators.required]],
    feeTypeId: [null, [Validators.required]],
    myServiceId: [null, [Validators.required]],
    createdBy: [],
    createdDate: [],
    lastModifiedBy: [],
    lastModifiedDate: [],
  });

  constructor(
    protected myServiceFeeService: MyServiceFeeService,
    protected activatedRoute: ActivatedRoute,
    protected feeTypeService: FeeTypeService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.feeTypeService.queryAll().subscribe(res => {
      const x: any = res.body;
      this.feeTypes = x;
      this.initServicesFees();
    });
  }
  initServicesFees() {
    if (this.myService === undefined || this.myService === null) {
      this.createNewMyServiceFeeList();
    } else {
      this.myServiceFeeService.findByServiceId(this.myService.id).subscribe(res => {
        const x: any = res.body;
        this.myServiceFees = x;

        if (this.myServiceFees === undefined || this.myServiceFees === null || this.myServiceFees.length === 0) {
          this.createNewMyServiceFeeList();
        }
      });
    }
  }
  private createNewMyServiceFeeList() {
    this.feeTypes.forEach(item => {
      const myServiceFee = {} as MyServiceFee;
      myServiceFee.fee = 0.0;
      myServiceFee.feeTypeId = item.id;
      if (this.myService !== null && this.myService !== undefined) {
        myServiceFee.myServiceId = this.myService.id;
      }

      this.myServiceFees.push(myServiceFee);
    });
  }
  getFeeTypeName(myServiceFee: MyServiceFee) {
    if (this.feeTypes === null || this.feeTypes === undefined) {
      return '';
    }
    const found = this.feeTypes.find(p => p.id === myServiceFee.feeTypeId);
    if (found !== undefined && found !== null) {
      return found.name;
    }

    return '';
  }

  initForSaveOrUpdate() {
    this.myServiceFees.forEach(item => {
      this.toAddOrUpdateServiceFees.push(item);
    });
  }

  updateForm(myServiceFee: any): void {
    this.editForm.patchValue({
      id: myServiceFee.id,
      fee: myServiceFee.fee,
      feeTypeId: myServiceFee.feeTypeId,
      myServiceId: myServiceFee.myServiceId,
      createdBy: myServiceFee.createdBy,
      createdDate: myServiceFee.createdDate ? myServiceFee.createdDate.format(DATE_TIME_FORMAT) : null,
      lastModifiedBy: myServiceFee.lastModifiedBy,
      lastModifiedDate: myServiceFee.lastModifiedDate ? myServiceFee.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    this.initForSaveOrUpdate();
    if (this.toAddOrUpdateServiceFees !== undefined && this.toAddOrUpdateServiceFees.length > 0) {
      const myServiceFeeUpdate: MyServiceFeeUpdate = new MyServiceFeeUpdate();
      myServiceFeeUpdate.myServiceFees = this.myServiceFees;
      this.subscribeToSaveResponse(this.myServiceFeeService.createList(myServiceFeeUpdate));
    }
  }

  private createFromForm(): MyServiceFee {
    const myServiceFee = {} as MyServiceFee;
    (myServiceFee.id = this.editForm.get(['id'])!.value),
      (myServiceFee.fee = this.editForm.get(['fee'])!.value),
      (myServiceFee.feeTypeId = this.editForm.get(['feeTypeId'])!.value),
      (myServiceFee.myServiceId = this.editForm.get(['myServiceId'])!.value),
      (myServiceFee.createdBy = this.editForm.get(['createdBy'])!.value),
      (myServiceFee.createdDate = this.editForm.get(['createdDate'])!.value
        ? dayjs(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : null),
      (myServiceFee.lastModifiedBy = this.editForm.get(['lastModifiedBy'])!.value),
      (myServiceFee.lastModifiedDate = this.editForm.get(['lastModifiedDate'])!.value
        ? dayjs(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
        : null);

    return myServiceFee;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<MyServiceFee[]>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res.body),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(res: MyServiceFee[] | null): void {
    this.isSaving = false;
    if (res != null) {
      this.myServiceFees = res;
    } else {
      this.myServiceFees = [];
    }
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
