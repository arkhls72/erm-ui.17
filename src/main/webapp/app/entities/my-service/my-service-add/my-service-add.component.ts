import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyService } from 'app/entities/my-service/my-service.model';
import { ServiceEventType } from 'app/entities/local-share/serviceEvent';
import { CommonServiceCode } from 'app/entities/common-service-code/common-service-code.model';
import { FeeType } from 'app/entities/fee-type/fee-type.model';
import { Observable, Subscription } from 'rxjs';

import { FormBuilder, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HttpResponse } from '@angular/common/http';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { MyServiceService } from '../service/my-service.service';
import { CommonServiceCodeService } from '../../common-service-code/service/common-service-code.service';
import { FeeTypeService } from '../../fee-type/service/fee-type.service';
import { ServiceTypeService } from '../../service-type/service/service-type.service';
import { DATE_TIME_FORMAT } from '../../../config/input.constants';

@Component({
  selector: 'bc-my-service-add',
  templateUrl: './my-service-add.component.html',
})
export class MyServiceAddComponent implements OnInit {
  isSaving = false;
  myServicePageFlow: ServiceEventType = ServiceEventType.GENERAL_ADD;

  commonServiceCode: CommonServiceCode = {} as CommonServiceCode;

  lastModifiedDateDp: any;
  selectedServiceCode?: CommonServiceCode;
  myService: MyService | null | undefined;
  feeTypes?: FeeType[];
  feeType?: FeeType;
  serviceCode?: CommonServiceCode;
  ifEmptyServiceCode = true;

  addingMode?: boolean;
  commonServiceCodes?: CommonServiceCode[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  currentSearch!: string;
  reverse: any;
  queryCount: any;
  editForm = this.fb.group({
    id: [],
    itemId: [null, [Validators.required, Validators.maxLength(20)]],
    description: [null, [Validators.required, Validators.maxLength(500)]],
    commonServiceCodeId: [],
    commonServiceCode: [],
    serviceCodeName: [],
    feeTypeId: [],
    unit: [],
    note: [null, [Validators.maxLength(350)]],
    lastModifiedBy: [],
    lastModifiedDate: [],
  });

  constructor(
    protected myServiceService: MyServiceService,
    protected activatedRoute: ActivatedRoute,
    protected commonServiceCodeService: CommonServiceCodeService,
    protected feeTypeService: FeeTypeService,
    private fb: FormBuilder,
    protected serviceTypeService: ServiceTypeService,
    protected router: Router,
    protected modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    if (this.myService === undefined || this.myService === null) {
      this.myService = {} as MyService;
    }
  }

  public initMyService(myService: MyService): void {
    this.myService = myService;
    this.updateForm();
  }

  private createFromForm(): MyService {
    const myService = {} as MyService;

    (myService.id = this.editForm.get(['id'])!.value),
      (myService.name = this.editForm.get(['name'])!.value),
      (myService.description = this.editForm.get(['description'])!.value),
      (myService.commonServiceCodeId = this.editForm.get(['commonServiceCodeId'])!.value),
      (myService.commonServiceCode = this.editForm.get(['commonServiceCode'])!.value),
      (myService.unit = this.editForm.get(['unit'])!.value),
      (myService.note = this.editForm.get(['note'])!.value),
      (myService.lastModifiedBy = this.editForm.get(['lastModifiedBy'])!.value),
      (myService.lastModifiedDate = this.editForm.get(['lastModifiedDate'])!.value);

    return myService;
  }

  updateForm(): void {
    const input: any = this.myService;
    if (input) {
      this.editForm.patchValue({
        id: input.id,
        itemId: input.name,
        description: input.description,
        commonServiceCodeId: input.commonServiceCodeId,
        unit: input.unit,
        note: input.note,
        lastModifiedBy: input.lastModifiedBy,
        lastModifiedDate: input.lastModifiedDate ? input.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
      });
    }
  }

  save(): void {
    this.isSaving = true;
    const myService = this.createFromForm();
    myService.lastModifiedDate = undefined;
    this.addingMode = true;
    this.subscribeToSaveResponse(this.myServiceService.create(myService));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<MyService>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res.body),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(res?: MyService | null): void {
    this.isSaving = false;
    this.myService = res;
    if (this.myService !== null && this.myService !== undefined) {
      this.router.navigate(['/my-service/' + this.myService.id + '/edit']);
    }
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  previousState(): void {
    window.history.back();
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
