import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { InsuranceEvent, InsuranceEventType } from 'app/entities/local-share/InsuranceEvent';
import { Ehc } from 'app/entities/ehc/ehc.model';
import { EhcPrimary } from 'app/entities/ehc-primary/ehc-primary.model';
import { Therapy } from 'app/entities/therapy/therapy.model';
import { CoverageTherapy } from 'app/entities/coverage/coverage-therapy.model';
import { Coverage } from 'app/entities/coverage/coverage.model';
import { EhcClient } from 'app/entities/ehc-client/ehc-client.model';
import { InsuranceClient } from 'app/entities/client/insurance-client.model';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { EhcEditStatus } from 'app/entities/ehc/ehc-edit-status.model';
import { EhcService } from '../../../ehc/service/ehc.service';
import { EhcClientService } from '../../../ehc-client/service/ehc-client.service';
import { CoverageService } from '../../../coverage/service/coverage.service';
import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from '../../../../config/input.constants';
import { EhcEdit } from '../../../ehc/ehc-edit.model';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  standalone: true,
  selector: 'bc-ehc-edit',
  templateUrl: './ehc-edit.component.html',
  imports: [ReactiveFormsModule, FormsModule, NgbInputDatepicker, FaIconComponent, NgIf, NgForOf],
})
export class EhcEditComponent implements OnInit {
  endDateDp: any;
  editMode = false;
  @Input()
  insuranceClient!: InsuranceClient;
  secondaryIds!: number[];
  // this is primary or secondary
  @Input()
  selectedEhc!: Ehc;

  @Output()
  saveEventEmitter = new EventEmitter();

  @Output()
  cancelEditEhc = new EventEmitter();

  @Output()
  secondaryEditEmitter = new EventEmitter<EhcClient>();

  coverages!: Coverage[];
  coverageTherapies!: CoverageTherapy[];
  therapies!: Therapy[];
  currentAccount: any;
  clientPrimaries!: EhcPrimary[];

  ehces!: Ehc[] | undefined;
  error: any;
  success: any;
  isSaving!: boolean;
  insuranceEventType: InsuranceEventType = InsuranceEventType.EHC_EDIT;
  selectedIndex!: number;
  isDeleting = false;
  statuses!: string[];
  ehcTypes!: string[];
  secondaryDependents?: EhcClient[];
  // holds secondary[ehcClient.id] and [ehcClient.status]
  secondariesMapIdStatus?: Map<number, string>;
  selectedEhcClient: EhcClient | null | undefined;
  isSecondaryCoverage!: boolean;
  editForm = this.fb.group({
    id: [],
    certificateNumber: [null, [Validators.maxLength(50)]],
    policyNumber: [null, [Validators.maxLength(50)]],
    policyHolder: [null, [Validators.maxLength(50)]],
    groupNumber: [null, [Validators.maxLength(50)]],
    name: [null, [Validators.maxLength(50)]],
    note: [null, [Validators.maxLength(350)]],
    status: [null, [Validators.maxLength(15)]],
    endDate: [],
    phone: [null, [Validators.maxLength(12)]],
    fax: [null, [Validators.maxLength(12)]],
    email: [null, [Validators.maxLength(50)]],
    clientId: [],
    type: [],
    lastModifiedBy: [],
    lastModifiedDate: [],
  });
  constructor(
    private ehcService: EhcService,
    private ehcClientService: EhcClientService,
    private datePipe: DatePipe,
    private coverageService: CoverageService,
    private fb: FormBuilder,
  ) {
    this.initListBox();
  }

  ngOnInit() {
    if (this.selectedEhc) {
      this.ehcService.getForEdit(this.selectedEhc.id).subscribe(resp => {
        const ehcEdit: EhcEdit | null = resp.body;
        if (ehcEdit) {
          this.selectedEhc = ehcEdit.primary as Ehc;
          this.selectedEhcClient = this.selectedEhc && this.selectedEhc.ehcClient ? this.selectedEhc.ehcClient : null;
          this.secondaryDependents = ehcEdit.dependents;
          this.initSecondaryDependentIds();
          this.updateForm(this.selectedEhc);
        }
      });
    } else {
      this.selectedEhc = {} as Ehc;
      this.updateForm(this.selectedEhc);
    }
  }
  runLoadFromParent(ehc: Ehc) {
    this.selectedEhc = ehc;
    this.ngOnInit();
  }
  updateForm(ehc: any): void {
    const date = dayjs(ehc.lastModifiedDate);
    const type: any = this.selectedEhcClient!.ehcType;
    ehc.lastModifiedDate = date;
    if (ehc) {
      this.editForm.patchValue({
        id: ehc.id,
        certificateNumber: ehc.certificateNumber,
        policyNumber: ehc.policyNumber,
        policyHolder: ehc.policyHolder,
        groupNumber: ehc.groupNumber,
        name: ehc.name,
        note: ehc.ehcClient && ehc.ehcClient.note ? ehc.ehcClient.note : null,
        status: ehc.status,
        endDate: this.editMode ? ehc.endDate : this.datePipe.transform(ehc.endDate, 'yyyy-MM-dd')!,
        phone: ehc.phone,
        fax: ehc.fax,
        email: ehc.email,
        clientId: ehc.clientId,
        // type is in selectedEhcClient
        type: type,
        // lastModifiedDate depends on the Type = Primay = Ehc.date secondary = ehcCleint.date
        //  lastModifiedDate: ehc.lastModifiedDate ? ehc.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
        lastModifiedDate:
          this.selectedEhcClient?.ehcType === 'Primary'
            ? ehc.lastModifiedDate
              ? ehc.lastModifiedDate.format(DATE_TIME_FORMAT)
              : undefined
            : this.selectedEhcClient!.lastModifiedDate
              ? this.selectedEhcClient!.lastModifiedDate.format(DATE_TIME_FORMAT)
              : null,
      });
    }
  }

  private createFromForm(): Ehc {
    const ehc = {} as Ehc;
    (ehc.id = this.editForm.get(['id'])!.value),
      (ehc.certificateNumber = this.editForm.get(['certificateNumber'])!.value),
      (ehc.policyNumber = this.editForm.get(['policyNumber'])!.value),
      (ehc.policyHolder = this.editForm.get(['policyHolder'])!.value),
      (ehc.groupNumber = this.editForm.get(['groupNumber'])!.value),
      (ehc.name = this.editForm.get(['name'])!.value),
      (ehc.status = this.selectedEhc.status),
      (ehc.endDate = this.editForm.get(['endDate'])!.value),
      (ehc.phone = this.editForm.get(['phone'])!.value),
      (ehc.note = this.editForm.get(['note'])!.value),
      (ehc.fax = this.editForm.get(['fax'])!.value),
      (ehc.email = this.editForm.get(['email'])!.value),
      (ehc.type = this.selectedEhcClient?.ehcType),
      (ehc.lastModifiedDate = this.editForm.get(['lastModifiedDate'])!.value
        ? dayjs(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
        : undefined);

    return ehc;
  }
  save() {
    const selectedEhc = this.createFromForm();
    const ehcClient: any = this.selectedEhc.ehcClient;

    if (ehcClient) {
      ehcClient.note = selectedEhc.note;
      ehcClient.ehcType = selectedEhc.type;
    }
    selectedEhc.ehcClient = ehcClient;

    if (selectedEhc.id) {
      const request = {} as EhcEdit;
      request.primary = selectedEhc;
      request.dependentStatuses = this.getDependencyMapIds();
      this.subscribeToSaveEditResponse(this.ehcService.updateWithDependent(request));
    }
    return false;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Ehc>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res.body),
      () => this.onSaveError(),
    );
  }

  getDependencyMapIds() {
    const dependentMapIds = [];

    if (this.secondariesMapIdStatus && this.secondariesMapIdStatus.size > 0) {
      for (const key of Array.from(this.secondariesMapIdStatus.keys())) {
        const s = new EhcEditStatus();
        s.id = key;
        s.status = this.secondariesMapIdStatus.get(key);
        dependentMapIds.push(s);
      }
    }
    return dependentMapIds;
  }
  protected subscribeToSaveEditResponse(result: Observable<HttpResponse<EhcEdit>>): void {
    result.subscribe(
      res => this.onSaveSuccessEdit(res.body),
      () => this.onSaveError(),
    );
  }
  protected onSaveSuccess(resp?: Ehc | null): void {
    if (resp instanceof Ehc) {
      this.selectedEhc = resp;
      this.updateForm(resp);
    }
  }

  protected onSaveSuccessEdit(resp?: EhcEdit | null): void {
    if (resp instanceof EhcEdit) {
      if (resp && resp.primary) {
        this.selectedEhc = resp.primary;
        this.updateForm(this.selectedEhc);
      }
    }
  }

  protected onSaveError(): void {
    this.isSaving = false;
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

  changeStatus(ehc?: Ehc, event?: Event) {
    this.selectedEhc.status = this.findElementStringValue(event);
  }

  changeSecondaryStatus(secondary: EhcClient, event?: Event) {
    const found: EhcClient = this.secondaryDependents?.find(item => item.id === secondary.id) as EhcClient;
    if (found && this.secondaryDependents) {
      found.status = this.findElementStringValue(event);
      this.secondaryDependents.forEach(item => {
        if (secondary.id === found.id) {
          item.status = found.status;
        }
      });

      if (this.secondariesMapIdStatus && found.id) {
        this.secondariesMapIdStatus.delete(found.id);
        this.secondariesMapIdStatus.set(found.id, found.status);
      }
    }
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
    this.selectedEhc = {} as Ehc;
    const ehcClient: EhcClient = {} as EhcClient;
    ehcClient.ehcType = 'Primary';
    this.selectedEhc.clientId = this.insuranceClient.clientId;
    this.selectedEhc.ehcClient = ehcClient;
    this.selectedEhc.status = 'Active';
    // this.loadAll(this.insuranceClient);
  }

  public ngOnCoverage() {
    // this.selectedEhc = this.ehces![i];
    const ehc: any = this.selectedEhc;

    if (ehc !== null && ehc !== undefined && ehc.ehcClient !== undefined) {
      this.isSecondaryCoverage = ehc.ehcClient!.ehcType === 'Secondary';
    } else {
      this.isSecondaryCoverage = false;
    }

    this.selectedEhc.clientId = this.insuranceClient.clientId;
    this.insuranceEventType = InsuranceEventType.EHC_COVERAGE;
    this.coverageService.queryByEhc(ehc.id).subscribe(res => {
      const copy2: any = res.body;
      this.coverages = copy2;
      this.initCoverage();
    });

    // this.loadAll(this.insuranceClient);
  }

  ngOnAddress() {
    this.selectedEhc.clientId = this.insuranceClient.clientId;
    this.insuranceEventType = InsuranceEventType.EHC_ADDRESS;
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
        copy.ehcId = this.selectedEhc.id;
        const coverage = this.getCoverageIdByTherapy(therapies[i].id);
        if (coverage !== null && coverage !== undefined) {
          if (coverage instanceof Coverage) {
            copy.coverageId = coverage.id;
            copy.note = coverage.note;
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

  private findElementStringValue(e: Event | undefined) {
    if (e) {
      return (e.target as HTMLInputElement).value;
    }
    return '';
  }

  /** ****************************************************************************
   *    Event Handler
   ** ****************************************************************************/

  backToEhc() {
    this.insuranceEventType = InsuranceEventType.EHC_EDIT;
    // this.loadAll(this.insuranceClient);
  }

  private onInsuranceEvent(evt: InsuranceEvent): void {
    if (evt.source && evt.type === InsuranceEventType.BACK) {
      this.insuranceEventType = InsuranceEventType.EHC_EDIT;
      this.isDeleting = false;
      // this.loadAll(this.insuranceClient);
      evt.type = this.insuranceEventType;
      return;
    }
  }

  initSelectedEhc(selectedEhc?: Ehc) {
    if (selectedEhc instanceof Ehc) {
      this.selectedEhc = selectedEhc;
    }
  }

  afterSaveCoverage() {
    this.saveEventEmitter.emit();
  }

  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    this.editMode = target.checked ? true : false;
    this.updateForm(this.selectedEhc);
    return this.editMode;
  }

  getSecondaryCreatedDate(secondary: EhcClient) {
    if (secondary && secondary.lastModifiedDate) {
      return this.datePipe.transform(secondary.lastModifiedDate.format('yyyy-MM-dd'));
    }
    return '';
  }

  isSelected(secondary: EhcClient): boolean {
    if (this.secondaryDependents) {
      const found = this.secondaryDependents.find(item => item.ehcId === secondary.ehcId);
      if (found && found.ehcType !== 'Deleted') {
        return true;
      }
      return false;
    }
    return false;
  }

  initSecondaryDependentIds() {
    this.secondariesMapIdStatus = new Map<number, string>();
    if (this.secondaryDependents && this.secondaryDependents.length > 0) {
      this.secondaryDependents.forEach(item => {
        if (item.id && item.status) {
          this.secondariesMapIdStatus?.set(item.id, item.status);
        }
      });
    }
  }

  addOrRemoveFromPrimary(secondary: EhcClient, event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      const found = this.secondaryDependents?.find(item => item.ehcId === secondary.ehcId);
      if (found) {
        if (found.id && found.status) {
          this.secondariesMapIdStatus!.set(found.id, found.status);
        }
      }
    } else {
      if (secondary && secondary.id) {
        const found = this.secondariesMapIdStatus?.get(secondary.id);
        if (found) {
          this.secondariesMapIdStatus?.delete(secondary.id);
        }
      }
    }
  }

  gotoSecondaryEdit(secondary: EhcClient) {
    const ehc = this.createFromForm();
    const ehcClient = secondary;
    ehcClient.primary = this.buildEhcPrimary(ehc);

    this.secondaryEditEmitter.emit(ehcClient);
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
}
