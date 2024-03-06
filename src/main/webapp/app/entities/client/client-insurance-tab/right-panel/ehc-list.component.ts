import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { InsuranceEvent, InsuranceEventType } from 'app/entities/local-share/InsuranceEvent';
import { Ehc } from 'app/entities/ehc/ehc.model';
import { EhcPrimary } from 'app/entities/ehc-primary/ehc-primary.model';
import { Therapy } from 'app/entities/therapy/therapy.model';
import { CoverageTherapy } from 'app/entities/coverage/coverage-therapy.model';
import { Coverage } from 'app/entities/coverage/coverage.model';
import { EhcClient } from 'app/entities/ehc-client/ehc-client.model';
import { InsuranceClient } from 'app/entities/client/insurance-client.model';
import { InsuranceEventService } from 'app/entities/local-share/insurance-event.service';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Client } from 'app/entities/client/client.model';
import { ActivatedRoute, Data, ParamMap } from '@angular/router';
import { EhcEdit } from 'app/entities/ehc/ehc-edit.model';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { EhcService } from '../../../ehc/service/ehc.service';
import { EhcClientService } from '../../../ehc-client/service/ehc-client.service';
import { CoverageService } from '../../../coverage/service/coverage.service';
import { TherapyService } from '../../../therapy/service/therapy.service';
import SortDirective from '../../../../shared/sort/sort.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ItemCountComponent } from '../../../../shared/pagination';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../../shared/date';
import { SortByDirective } from '../../../../shared/sort';
import SharedModule from '../../../../shared/shared.module';

//  this is called when we check(select) a primary to be add as a secondary /api/ehc-clients/secondary
@Component({
  standalone: true,
  selector: 'bc-ehc-list',
  templateUrl: './ehc-list.component.html',
  imports: [
    FaIconComponent,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
  ],
})
export class EhcListComponent implements OnInit {
  @Input()
  client!: Client;

  @Input()
  insuranceClient!: InsuranceClient;

  @Output()
  eventEmitter = new EventEmitter<Ehc>();

  @Output()
  deleteEventEmitter = new EventEmitter<Ehc>();

  @Output()
  secondaryEditEmitter = new EventEmitter<EhcClient>();

  secondaryEhcClients!: EhcClient[];
  coverages!: Coverage[];
  coverageTherapies!: CoverageTherapy[];
  therapies!: Therapy[];
  currentAccount: any;
  clientPrimaries!: EhcPrimary[];
  selectedEhc!: Ehc;

  ehces: Ehc[] | undefined = [];
  error: any;
  endDateDp: any;
  success: any;
  isSaving!: boolean;
  insuranceEventType: InsuranceEventType = InsuranceEventType.EHC_EDIT;
  selectedIndex!: number;
  isDeleting = false;
  eventSubscription!: Subscription;
  statuses!: string[];
  ehcTypes!: string[];
  ehc!: Ehc;
  ehcClient!: EhcClient;
  isSecondaryCoverage!: boolean;

  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;

  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    private ehcService: EhcService,
    private ehcClientService: EhcClientService,
    private coverageService: CoverageService,
    private therapyService: TherapyService,
    protected activatedRoute: ActivatedRoute,
    // protected router: Router,
    private insuranceEventService: InsuranceEventService, // protected modalService: NgbModal
  ) {
    // init at startup
    this.initListBox();
  }
  static ifSelectedRowCreated(selectedEhc: Ehc) {
    if (
      selectedEhc !== null &&
      selectedEhc !== undefined &&
      selectedEhc.name !== '' &&
      selectedEhc.name !== undefined &&
      selectedEhc.policyNumber !== '' &&
      selectedEhc.policyNumber !== undefined
    ) {
      return true;
    }

    return false;
  }

  ngOnInit() {
    this.isDeleting = false;
    this.handleNavigation();
  }

  loadPage(page?: number) {
    const pageToLoad: number = page || this.page || 1;
    this.ehcService
      .findByClientPageable(
        {
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        },
        this.client.id,
      )
      .subscribe(
        (res: HttpResponse<Ehc[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
        () => this.onError(),
      );
  }
  save(i: number) {
    const insuranceClient: any = this.insuranceClient;
    const selectedPrimaryEhc = this.ehces![i];
    if (selectedPrimaryEhc && selectedPrimaryEhc.id !== undefined) {
      this.subscribeToSaveResponse(this.ehcService.update(selectedPrimaryEhc));
    } else if (EhcListComponent.ifSelectedRowCreated(selectedPrimaryEhc)) {
      this.subscribeToSaveResponse(this.ehcService.createForClient(selectedPrimaryEhc, insuranceClient.clientId));
    } else {
      return false;
    }

    return false;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Ehc>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.isDeleting = false;
    // this.loadAll();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  deleteRow(i: number) {
    if (this.ehces!.length === 0) {
      return false;
    }

    this.selectedEhc = this.ehces![i];
    if (this.selectedEhc === null || this.selectedEhc === undefined || this.selectedEhc.id === null || this.selectedEhc.id === undefined) {
      this.ehces!.splice(i, 1);
      return true;
    }

    this.isDeleting = true;
    this.selectedIndex = i;
    this.ehc = this.selectedEhc;
    this.insuranceEventType = InsuranceEventType.EHC_DELETE;
    this.deleteEventEmitter.emit(this.ehc);

    return true;
  }

  protected subscribeToDeleteResponse(result: Observable<HttpResponse<Ehc>>): void {
    result.subscribe(
      () => this.onDeleteSuccess(),
      () => this.onError(),
    );
  }

  private onDeleteSuccess() {
    this.isDeleting = false;

    this.ehces!.splice(this.selectedIndex, 1);
    const selectedIndex: any = null;
    this.selectedIndex = selectedIndex;
  }

  private onError() {
    this.isDeleting = false;
  }

  changeStatus(ehc: Ehc, event: Event) {
    const insuranceClient: any = this.insuranceClient;
    ehc.status = this.findElementStringValue(event);
    const ehces: any = this.ehces;
    ehces.find((p: { id: number | undefined }) => p.id === ehc.id).status = ehc.status;
    const foundEhc = insuranceClient.ehces.find((p: { id: number | undefined }) => p.id === ehc.id);
    if (foundEhc !== null && foundEhc !== undefined) {
      insuranceClient.ehces.find((p: { id: number | undefined }) => p.id === ehc.id).status = ehc.status;
    }
    this.insuranceClient = insuranceClient;
  }

  initListBox() {
    this.statuses = [];
    this.statuses.push('Active');
    this.statuses.push('Inactive');

    this.ehcTypes = [];
    this.ehcTypes.push('Primary');
    this.ehcTypes.push('Secondary');
  }

  ngAddPrimary() {
    this.insuranceEventType = InsuranceEventType.EHC_ADD_PRIMARY;
    this.ehc = {} as Ehc;
    const ehcClient: EhcClient = {} as EhcClient;
    ehcClient.ehcType = 'Primary';
    this.ehc.clientId = this.insuranceClient.clientId;
    this.ehc.ehcClient = ehcClient;
    this.ehc.status = 'Active';
    // this.loadAll();
  }

  public ngOnCoverage(i: number) {
    this.ehc = this.ehces![i];
    const ehc: any = this.ehc;

    if (ehc !== null && ehc !== undefined && ehc.ehcClient !== undefined) {
      this.isSecondaryCoverage = ehc.ehcClient!.ehcType === 'Secondary';
    } else {
      this.isSecondaryCoverage = false;
    }

    this.ehc.clientId = this.insuranceClient.clientId;
    this.insuranceEventType = InsuranceEventType.EHC_COVERAGE;
    this.coverageService.queryByEhc(ehc.id).subscribe(res => {
      const copy2: any = res.body;
      this.coverages = copy2;
      this.initCoverage();
    });

    // this.loadAll();
  }

  ngOnAddress(i: number) {
    this.ehc = this.ehces![i];
    this.ehc.clientId = this.insuranceClient.clientId;
    this.insuranceEventType = InsuranceEventType.EHC_ADDRESS;
    this.ngOnInit();
  }

  ngOnEhcSecondary() {
    const ehcClient: any = {} as EhcClient;
    ehcClient.clientId = this.insuranceClient.clientId;
    this.ehcClient = ehcClient;
    this.insuranceEventType = InsuranceEventType.EHC_SECONDARY;
    this.ehcClientService.querySecondaryByClientId(ehcClient.clientId).subscribe(res => {
      const secondaryEhcClients: any = res.body;
      this.secondaryEhcClients = secondaryEhcClients;
    });
    this.ngOnInit();
  }

  public initCoverage() {
    const therapies: any = this.therapies;
    const array = [];
    if (this.therapies !== undefined && this.therapies !== null) {
      for (let i = 0; i < this.therapies.length; i++) {
        const copy: CoverageTherapy = new CoverageTherapy();
        copy.therapyId = this.therapies[i].id;
        copy.therapyName = this.therapies[i].name;
        copy.ehcId = this.ehc.id;
        const coverage = this.getCoverageIdByTherapy(therapies[i].id);
        if (coverage !== null && coverage !== undefined) {
          if (coverage instanceof Coverage) {
            copy.coverageId = coverage.id;
          }
          if (coverage instanceof Coverage) {
            copy.note = coverage.note;
          }
          if (coverage instanceof Coverage) {
            copy.limit = coverage.limit;
          }
        }
        array.push(copy);
      }
      this.coverageTherapies = array;
    }
  }
  private getCoverageIdByTherapy(therapyId: number) {
    if (this.coverages !== null && this.coverages !== undefined) {
      return this.coverages.find(p => p.therapyId === therapyId);
    }

    return false;
  }

  private findElementStringValue(e: Event) {
    return (e.target as HTMLInputElement).value;
  }

  /** ****************************************************************************
   *    Event Handler
   ** ****************************************************************************/

  backToInsuranceTab() {
    this.insuranceClient.isBack = InsuranceEventType.BACK.toString();
    this.insuranceEventService.publish(new InsuranceEvent(InsuranceEventType.BACK, {} as Ehc, 'client-insurance-tab'));
  }

  backToEhc() {
    this.insuranceEventType = InsuranceEventType.EHC_EDIT;
    // this.loadAll();
  }

  private onInsuranceEvent(evt: InsuranceEvent): void {
    if (evt.source && evt.type === InsuranceEventType.BACK) {
      this.insuranceEventType = InsuranceEventType.EHC_EDIT;
      this.isDeleting = false;
      // this.loadAll();
      evt.type = this.insuranceEventType;
      return;
    }
  }
  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    return result;
  }
  protected onSuccess(data: Ehc[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.ehces = data || [];
    this.ngbPaginationPage = this.page;
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

  trackId(index: number, item: Ehc): number {
    return item.id!;
  }

  getEhcType(ehc?: Ehc) {
    if (ehc?.ehcClient) {
      return ehc.ehcClient.ehcType;
    }

    return '';
  }

  getMyStatus(ehc?: Ehc) {
    if (ehc?.ehcClient) {
      return ehc.ehcClient.status;
    }

    return '';
  }

  ngOnEhcEdit(ehc: Ehc) {
    if (ehc && ehc.ehcClient) {
      const ehcClient = ehc.ehcClient;
      if (ehcClient && ehcClient.ehcType && ehcClient.ehcType === 'Primary') {
        this.insuranceEventType = InsuranceEventType.EHC_EDIT;
        const selectedEhc: Ehc = this.ehces!.find(item => item.id === ehc.id) as Ehc;
        this.selectedEhc = selectedEhc;
        this.eventEmitter.emit(selectedEhc);
      } else {
        const ehcPrimary = this.buildEhcPrimary(ehc);
        if (ehcPrimary) {
          ehcClient.primary = ehcPrimary;
          this.secondaryEditEmitter.emit(ehcClient);
        }
      }
    }
  }

  buildEhcPrimary(ehc: Ehc) {
    const ehcPrimary = {} as EhcPrimary;
    ehcPrimary.policyHolder = ehc.policyHolder;
    ehcPrimary.clientId = ehc.clientId;
    ehcPrimary.endDate = ehc.endDate;
    ehcPrimary.lastModifiedDate = ehc.lastModifiedDate;
    ehcPrimary.ehcType = 'Primary';
    ehcPrimary.ehcId = ehc.id;
    ehcPrimary.status = ehc.status;
    ehcPrimary.name = ehc.name;
    ehcPrimary.note = ehc.note;
    ehcPrimary.groupNumber = ehc.groupNumber;
    ehcPrimary.policyNumber = ehc.policyNumber;
    ehcPrimary.certificateNumber = ehc.certificateNumber;
    ehcPrimary.phone = ehc.phone;
    ehcPrimary.fax = ehc.fax;
    ehcPrimary.email = ehc.email;

    return ehcPrimary;
  }
  /*
      EhdEdit is used as placehodler wrapper to send :
      1. Primary values as EhcCleint
      2. Primary Details values in EHC
      3.
  */
  createPrimaryForEdit(ehc: Ehc) {
    const ehdEdit = {} as EhcEdit;
    const primary = {} as EhcClient;
    // we convert ehc to primary EhcClient
    primary.ehcId = ehc.id;
    primary.ehcType = ehc.type;
    primary.lastModifiedDate = ehc.lastModifiedDate;
    primary.endDate = ehc.endDate;
    primary.clientId = ehc.clientId;
    primary.policyHolder = ehc.policyHolder;
    primary.note = ehc.note;
    ehdEdit.primaryDetail = ehc;
    ehdEdit.primaryDetail.ehcClient = undefined;
  }

  editPrimaryPolicyHolder(ehc: Ehc) {
    this.insuranceEventType = InsuranceEventType.EHC_EDIT;
    const selectedEhc: Ehc = this.ehces!.find(item => item.id === ehc.id) as Ehc;
    this.selectedEhc = selectedEhc;
    this.eventEmitter.emit(selectedEhc);
  }

  ifPrimary(ehc: Ehc) {
    if (ehc && ehc.ehcClient) {
      return ehc.ehcClient.ehcType === 'Primary';
    }
    return false;
  }
}
