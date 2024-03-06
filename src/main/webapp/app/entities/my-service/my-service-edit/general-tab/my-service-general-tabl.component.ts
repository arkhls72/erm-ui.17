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
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { MyServiceService } from '../../service/my-service.service';
import { CommonServiceCodeService } from '../../../common-service-code/service/common-service-code.service';
import { FeeTypeService } from '../../../fee-type/service/fee-type.service';
import { ServiceTypeService } from '../../../service-type/service/service-type.service';
import { DATE_TIME_FORMAT } from '../../../../config/input.constants';

@Component({
  selector: 'bc-my-service-general-tab',
  templateUrl: './my-service-general-tab.component.html',
})
export class MyServiceGeneralTablComponent implements OnInit {
  isSaving = false;
  myServicePageFlow: ServiceEventType = ServiceEventType.GENERAL_ADD;

  commonServiceCode: CommonServiceCode = {} as CommonServiceCode;

  lastModifiedDateDp: any;
  selectedServiceCode?: CommonServiceCode;
  myService: MyService | null | undefined;
  feeTypes?: FeeType[];
  feeType?: FeeType;
  // serviceCodes?: CommonServiceCode[];
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
  // dataLength!: boolean;
  currentSearch!: string;
  // previousPage: any;
  reverse: any;
  queryCount: any;
  // serviceTypes!: ServiceType[];
  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(20)]],
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
  ) {
    // this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    // this.itemsPerPage = ITEMS_PER_PAGE;
    // this.page = 1;
    // this.previousPage = 1;
    // this.reverse = true;
    // this.predicate = 'id';
  }

  ngOnInit(): void {
    if (this.myService !== null && this.myService !== undefined) {
      this.updateForm();
    }
    this.activatedRoute.data.subscribe(({ myService }) => {
      if (myService.commonServiceCodeId === undefined || myService.commonServiceCodeId === null) {
        this.selectedServiceCode = undefined;
      } else {
        this.commonServiceCodeService.find(myService.commonServiceCodeId).subscribe(p => {
          const x: any = p.body;
          this.commonServiceCode = x;
          const commonSvcCode: any = this.commonServiceCode;
          this.editForm.patchValue({
            commonServiceCode: commonSvcCode.serviceCode,
          });
        });
      }
      this.initMyService(myService);
    });
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
    const myService: any = this.myService;
    if (myService) {
      this.editForm.patchValue({
        id: myService.id,
        name: myService.name,
        description: myService.description,
        commonServiceCodeId: myService.commonServiceCodeId,
        unit: myService.unit,
        note: myService.note,
        lastModifiedBy: myService.lastModifiedBy,
        lastModifiedDate: myService.lastModifiedDate ? myService.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
      });
    }
  }

  save(): void {
    this.isSaving = true;
    const myService = this.createFromForm();
    myService.lastModifiedDate = undefined;
    if (myService.id !== undefined) {
      this.subscribeToSaveResponse(this.myServiceService.update(myService));
    } else {
      this.addingMode = true;
      this.subscribeToSaveResponse(this.myServiceService.create(myService));
    }
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
    this.updateForm();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  previousState(): void {
    // this.isServiceCodeColumnEnable = false;
    window.history.back();
  }

  onGeneral() {
    this.myServicePageFlow = ServiceEventType.GENERAL_ADD;
  }
  onImportService() {
    if (this.myService !== undefined && this.myService !== null && this.myService.id !== null && this.myService.id !== undefined) {
      this.myServicePageFlow = ServiceEventType.IMPORT_COMMON_SERVICE;
    }
  }

  onFeeAddService() {
    if (this.myService !== undefined && this.myService !== null && this.myService.id !== null && this.myService.id !== undefined) {
      this.myServicePageFlow = ServiceEventType.FEE_ADD;
    }
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  trackId(index: number, item: CommonServiceCode): number {
    return item.id!;
  }
  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }
  // refreshServiceCodeByChild(commonServiceCode: CommonServiceCode) {
  //   this.commonServiceCode = commonServiceCode;
  //   if (this.myService !== undefined && this.myService !== null) {
  //     this.myService.commonServiceCodeId = this.commonServiceCode !== undefined ? this.commonServiceCode.id: undefined;
  //     this.editForm.patchValue({
  //       description: this.commonServiceCode !== undefined && this.commonServiceCode !== null ? this.commonServiceCode.description:undefined,
  //       commonServiceCodeId: this.myService.commonServiceCodeId
  //     });
  //   }
  // }
}
