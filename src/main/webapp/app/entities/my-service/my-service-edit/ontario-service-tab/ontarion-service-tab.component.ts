import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { MyService } from 'app/entities/my-service/my-service.model';

import { CommonServiceCode } from 'app/entities/common-service-code/common-service-code.model';
import { FeeType } from 'app/entities/fee-type/fee-type.model';
import { ServiceType } from 'app/entities/service-type/service-type.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceEventType } from 'app/entities/local-share/serviceEvent';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { CommonServiceCodeService } from '../../../common-service-code/service/common-service-code.service';
import { FeeTypeService } from '../../../fee-type/service/fee-type.service';
import { ServiceTypeService } from '../../../service-type/service/service-type.service';
import { MyServiceService } from '../../service/my-service.service';

@Component({
  selector: 'bc-ontario-service-tab',
  templateUrl: './ontario-service-tab.component.html',
})
export class OntarioServiceTabComponent implements OnInit {
  isSaving = true;
  myServicePageFlow: ServiceEventType = ServiceEventType.GENERAL_ADD;

  @Output()
  eventEmitter = new EventEmitter<MyService>();

  @Output()
  eventServiceEmitter = new EventEmitter<MyService>();

  lastModifiedDateDp: any;
  selectedCommonServiceCode?: CommonServiceCode;
  commonServiceCodeId?: number;

  @Input()
  myService: MyService | null | undefined;

  feeTypes?: FeeType[];
  feeType?: FeeType;

  // isServiceCodeColumnEnable = false;
  serviceCodes!: CommonServiceCode[];
  serviceCode?: CommonServiceCode;
  // ifEmptyServiceCode = true;

  addingMode?: boolean;
  commonServiceCodes?: CommonServiceCode[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  dataLength!: boolean;
  currentSearch!: string;
  previousPage: any;
  reverse: any;
  queryCount: any;
  serviceTypes!: ServiceType[];

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
    this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 1;
    this.previousPage = 1;
    this.reverse = true;
    this.predicate = 'id';
  }

  ngOnInit(): void {
    this.loadAll();
    // this.initRadioBoxes();
    this.initServiceType();
  }
  save(): void {
    const myService: MyService | null | undefined = this.myService;
    if (myService !== undefined && myService !== null && myService.id !== undefined) {
      this.subscribeToSaveResponse(this.myServiceService.update(myService));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<MyService>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res.body),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(res?: MyService | null): void {
    this.isSaving = true;
    this.myService = res;
  }

  protected onSaveError(): void {
    this.isSaving = true;
  }
  // we call to get CommonserviceCode
  initRadioBoxes() {
    this.commonServiceCodeService
      .query()
      .subscribe((res: HttpResponse<CommonServiceCode[]>) => this.initCommonServiceCode((this.serviceCodes = res.body || [])));
  }

  initCommonServiceCode(res: CommonServiceCode[]) {
    this.commonServiceCodes = res;
    const found: any = this.commonServiceCodes.find(p => p.id === this.commonServiceCodeId);
    this.selectedCommonServiceCode = found;
  }

  getFeeType(myService: any) {
    const feeTypes: any = this.feeTypes;
    const foundFeeType = feeTypes.find((p: { id: number | undefined }) => p.id === myService.feeTypeId);
    if (foundFeeType) {
      return foundFeeType.name;
    }
    return '';
  }

  getServiceCode(myService: any) {
    const serviceCodes: any = this.serviceCodes;
    const foundServiceCode = serviceCodes.find((p: { id: number | undefined }) => p.id === myService.commonServiceCodeId);
    if (foundServiceCode) {
      return foundServiceCode.serviceCode;
    }
    return '';
  }

  changeFeeType(e: Event) {
    const feeTypes: any = this.feeTypes;
    const eventValue: number = parseInt((e.target as HTMLInputElement).value, 10);
    const foundFeeType = feeTypes.find((p: { id: any }) => p.id === eventValue);
    return foundFeeType.id;
  }

  previousState(): void {
    window.history.back();
  }

  onGeneral() {
    this.myServicePageFlow = ServiceEventType.GENERAL_ADD;
  }

  addSelectService(source: CommonServiceCode) {
    this.isSaving = false;
    this.selectedCommonServiceCode = source;
    if (this.myService !== undefined && this.myService !== null) {
      this.myService.commonServiceCodeId = this.selectedCommonServiceCode.id;
    }
  }

  removeSelectService() {
    this.isSaving = false;
    const x: any = document.getElementsByName('selectedCommonServiceCode');
    if (x !== undefined && x !== null && x.length > 0) {
      for (let i = 0; i < x.length; i++) {
        x[i].checked = false;
      }
    }
    //  The selected CommonServiceCode.servicCode = undefined.
    this.selectedCommonServiceCode = undefined;
    if (this.myService !== undefined && this.myService !== null) {
      this.myService.commonServiceCodeId = undefined;
      this.eventEmitter.emit(this.myService);
    }
  }

  // this is for import Comon
  initServiceType() {
    this.serviceTypeService.query().subscribe((res: HttpResponse<ServiceType[]>) => (this.serviceTypes = res.body || []));
  }
  getServiceType(c: CommonServiceCode) {
    if (this.serviceTypes === undefined || this.serviceTypes === null) {
      return '';
    }

    const foundService: any = this.serviceTypes.find(item => item.id === c.id);
    if (foundService) {
      return foundService.name;
    }
    return '';
  }

  isSelected(commonServiceCode: CommonServiceCode): boolean {
    if (this.myService !== undefined && commonServiceCode.id === this.myService!.commonServiceCodeId) {
      return true;
    }
    return false;
  }

  search(query: string) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadAll();
  }

  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.loadAll();
  }

  isReadMore(data: string) {
    this.dataLength = !(data.length > 30);
  }

  protected onSuccessServiceCode(data: any, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.queryCount = this.totalItems;
    this.commonServiceCodes = data;
    this.initCommonServiceCode(data);
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
  loadAll(): void {
    // if (this.isServiceCodeColumnEnable && !this.ifEmptyServiceCode ) {
    if (this.currentSearch) {
      this.commonServiceCodeService
        .search({
          query: this.currentSearch,
          page: this.page - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe(
          (res: HttpResponse<CommonServiceCode[]>) => this.onSuccessServiceCode(res.body, res.headers),
          () => this.onError(),
        );
    } else {
      this.commonServiceCodeService
        .query({
          page: this.page - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe(
          (res: HttpResponse<CommonServiceCode[]>) => this.onSuccessServiceCode(res.body, res.headers),
          () => this.onError(),
        );
    }
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.loadAll();
    }
  }

  ifSelectedServiceCodeHasValue() {
    if (this.selectedCommonServiceCode === undefined || this.selectedCommonServiceCode === null) {
      return '';
    }
    return this.selectedCommonServiceCode.serviceCode;
  }
}
