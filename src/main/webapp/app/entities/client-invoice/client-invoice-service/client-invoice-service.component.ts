import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data, RouterLink, RouterModule } from '@angular/router';
import { Subscription, combineLatest, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MyService } from 'app/entities/my-service/my-service.model';
import { FeeType } from 'app/entities/fee-type/fee-type.model';
import { CommonServiceCode } from 'app/entities/common-service-code/common-service-code.model';
import { Client } from 'app/entities/client/client.model';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { MyServiceService } from '../../my-service/service/my-service.service';
import { CommonServiceCodeService } from '../../common-service-code/service/common-service-code.service';
import { FeeTypeService } from '../../fee-type/service/fee-type.service';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import SharedModule from '../../../shared/shared.module';
import { SortByDirective, SortDirective } from '../../../shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../shared/date';
import { ItemCountComponent } from '../../../shared/pagination';

@Component({
  standalone: true,
  selector: 'bc-client-invoice-service',
  templateUrl: './client-invoice-service.component.html',
  imports: [
    FormsModule,
    RouterLink,
    AlertErrorComponent,
    AlertComponent,
    FaIconComponent,
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
  ],
})
export class ClientInvoiceServiceComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  myServices?: MyService[];
  clinet?: Client;
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  feeTypes?: FeeType[];
  serviceCodes?: CommonServiceCode[];
  currentSearch!: string;

  constructor(
    protected myServiceService: MyServiceService,
    protected commonServiceCodeService: CommonServiceCodeService,
    protected feeTypeService: FeeTypeService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.initListBox();
    this.handleNavigation();
    this.loadPage();
  }

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page || 1;
    if (this.currentSearch) {
      this.myServiceService
        .search({
          query: this.currentSearch,
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe(
          (res: HttpResponse<MyService[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
          () => this.onError(),
        );
    } else {
      this.myServiceService
        .query({
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe(
          (res: HttpResponse<MyService[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
          () => this.onError(),
        );
    }
  }

  protected handleNavigation(): void {
    combineLatest(this.activatedRoute.data, this.activatedRoute.queryParamMap, (data: Data, params: ParamMap) => {
      const defaultSort: string[] = [];
      defaultSort.push('id');
      defaultSort.push('asc');

      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort =
        params.get('sort') !== null && params.get('sort') !== undefined
          ? (params.get('sort') ?? data['defaultSort']).split(',')
          : defaultSort;
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber);
      }
    }).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackId(index: number, item: MyService): number {
    return item.id!;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: MyService[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.myServices = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  initListBox() {
    this.commonServiceCodeService.query().subscribe((res: HttpResponse<CommonServiceCode[]>) => (this.serviceCodes = res.body || []));
    this.feeTypeService.query().subscribe((res: HttpResponse<FeeType[]>) => (this.feeTypes = res.body || []));
  }

  getFeeType(myService: any) {
    const feeTypes: any = this.feeTypes;
    if (feeTypes !== undefined && feeTypes !== null && feeTypes.length > 0) {
      const foundFeeType = feeTypes.find((p: { id: number | undefined }) => p.id === myService.feeTypeId);
      if (foundFeeType) {
        return foundFeeType.name;
      }
    }
  }

  getServiceCode(myService: any) {
    const serviceCodes: any = this.serviceCodes;
    const foundServiceCode = serviceCodes.find((p: { id: number | undefined }) => p.id === myService.commonServiceCodeId);
    if (foundServiceCode) {
      return foundServiceCode.serviceCode;
    }
    return '';
  }

  search(query: string) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadPage();
  }

  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.loadPage();
  }
  isSelected(myService: MyService): boolean {
    const found: any = this.myServices?.find(p => myService.id === p.id);
    if (found) {
      return true;
    }
    return false;
  }
}
