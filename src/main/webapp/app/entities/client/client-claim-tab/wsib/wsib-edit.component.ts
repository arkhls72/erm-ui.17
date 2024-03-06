import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Coverage } from 'app/entities/coverage/coverage.model';
import { Therapy } from 'app/entities/therapy/therapy.model';
import { CoverageTherapy } from 'app/entities/coverage/coverage-therapy.model';
import { ClaimEvent, ClaimEventType } from 'app/entities/local-share/claim-event';
import { Wsib } from 'app/entities/wsib/wsib.model';
import { ClaimEventService } from 'app/entities/local-share/claim-event.service';
import { HttpResponse } from '@angular/common/http';
import { Client } from 'app/entities/client/client.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import { WsibService } from '../../../wsib/service/wsib.service';
import { CoverageService } from '../../../coverage/service/coverage.service';
import { TherapyService } from '../../../therapy/service/therapy.service';
import { DATE_TIME_FORMAT } from '../../../../config/input.constants';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  selector: 'bc-wsib-edit',
  templateUrl: './wsib-edit.component.html',
  imports: [FaIconComponent, NgIf, ReactiveFormsModule, NgbInputDatepicker],
})
export class WsibEditComponent implements OnInit {
  editMode = false;
  coverages!: Coverage[];
  coverageTherapies!: CoverageTherapy[];
  therapies!: Therapy[];
  currentAccount: any;
  error: any;
  accidentDateDp: any;
  success: any;
  isSaving!: boolean;
  claimEventType: ClaimEventType = ClaimEventType.WSIB_EDIT;
  selectedIndex!: number;
  isDeleting = false;
  eventSubscriber!: Subscription;
  statuses!: string[];
  wsibs!: Wsib[];

  @Input()
  selectedWsib!: Wsib;

  @Input()
  client!: Client;
  eventSubscription!: Subscription;
  subscription?: Subscription;
  editForm = this.fb.group({
    id: [],
    employer: [null, [Validators.required, Validators.maxLength(50)]],
    claimNumber: [null, [Validators.maxLength(50)]],
    clientId: [],
    supervisor: [null, [Validators.maxLength(50)]],
    accidentDate: [null, [Validators.required]],
    adjudicator: [null, [Validators.maxLength(50)]],
    caseManager: [null, [Validators.maxLength(50)]],
    status: [null, [Validators.maxLength(15)]],
    phone: [null, [Validators.maxLength(12)]],
    cellPhone: [null, [Validators.maxLength(12)]],
    phoneExtension: [null, [Validators.maxLength(10)]],
    email: [null, [Validators.maxLength(50)]],
    closeDate: [],
    lastModifiedDate: [],
    note: [null, [Validators.maxLength(350)]],
    fax: [null, [Validators.maxLength(12)]],
  });
  constructor(
    private wsibService: WsibService,
    private coverageService: CoverageService,
    private therapyService: TherapyService,
    private datePipe: DatePipe,
    private claimEventService: ClaimEventService,
    private fb: FormBuilder,
  ) {
    this.initListBox();
  }

  ngOnInit() {
    this.updateForm(this.selectedWsib);
  }
  updateForm(wsib: any): void {
    this.editForm.patchValue({
      id: wsib.id,
      employer: wsib.employer,
      claimNumber: wsib.claimNumber,
      clientId: wsib.clientId,
      supervisor: wsib.supervisor,
      accidentDate: this.editMode ? wsib.accidentDate : this.datePipe.transform(wsib.accidentDate, 'yyyy-MM-dd')!,
      adjudicator: wsib.adjudicator,
      caseManager: wsib.caseManager,
      status: wsib.status,
      phone: wsib.phone,
      phoneExtension: wsib.phoneExtension,
      cellPhone: wsib.cellPhone,
      closeDate: wsib.closeDate,
      note: wsib.note,
      fax: wsib.fax,
      lastModifiedDate: wsib.lastModifiedDate ? wsib.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
    });
  }
  loadAll() {}

  save() {
    if (this.selectedWsib && this.selectedWsib.id) {
      this.subscribeToSaveResponse(this.wsibService.update(this.selectedWsib));
    } else {
      this.subscribeToSaveResponse(this.wsibService.createForClient(this.selectedWsib, this.client.id));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Wsib>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.isDeleting = false;
    this.loadAll();
  }

  protected onSaveError(): void {
    this.isSaving = false;
    const selectedIndex: any = null;
    this.selectedIndex = selectedIndex;
  }

  deleteRow(i: number) {
    if (this.wsibs.length === 0) {
      return false;
    }

    this.selectedWsib = this.wsibs[i];
    if (
      this.selectedWsib === null ||
      this.selectedWsib === undefined ||
      this.selectedWsib.id === null ||
      this.selectedWsib.id === undefined
    ) {
      this.wsibs.splice(i, 1);
      return true;
    }

    if (!this.isDeleting) {
      this.selectedIndex = i;
      this.claimEventType = ClaimEventType.WSIB_DELETE;
      this.loadAll();
    }

    return false;
  }

  protected subscribeToDeleteResponse(result: Observable<HttpResponse<Wsib>>): void {
    result.subscribe(
      () => this.onDeleteSuccess(),
      () => this.onError(),
    );
  }

  private onDeleteSuccess() {
    this.isDeleting = false;
    this.wsibs.splice(this.selectedIndex, 1);
    const selectedIndex: any = null;
    this.selectedIndex = selectedIndex;
  }

  private onError() {
    this.isDeleting = false;
  }

  changeStatus(e: Event) {
    this.selectedWsib.status = this.findElementStringValue(e);
  }

  initListBox() {
    this.statuses = [];
    this.statuses.push('Open');
    this.statuses.push('Close');
    this.statuses.push('InProgress');
  }

  public ngOnCoverage(i: number) {
    const wsib: any = this.wsibs[i];
    this.selectedWsib = wsib;

    this.claimEventType = ClaimEventType.WSIB_COVERAGE;

    this.coverageService.queryByWsib(wsib.id).subscribe(res => {
      const copy2: any = res.body;
      this.coverages = copy2;
      this.initCoverage();
    });

    this.therapyService.queryAll().subscribe(res => {
      const copy1: any = res.body;
      this.therapies = copy1;
    });

    this.loadAll();
  }

  ngOnAddress(i: number) {
    this.selectedWsib = this.wsibs[i];
    this.claimEventType = ClaimEventType.WSIB_ADDRESS;
    this.loadAll();
  }

  ngOnAddWsib() {
    this.selectedWsib = new Wsib();
    this.claimEventType = ClaimEventType.WSIB_ADD;
    this.loadAll();
  }

  public initCoverage() {
    const array = [];
    const therapies: any = this.therapies;

    if (therapies !== undefined && therapies !== null) {
      for (let i = 0; i < this.therapies.length; i++) {
        const copy: CoverageTherapy = new CoverageTherapy();
        copy.therapyId = this.therapies[i].id;
        copy.therapyName = this.therapies[i].name;
        copy.wsibId = this.selectedWsib.id;
        const coverage: any = this.getCoverageIdByTherapy(therapies[i].id);
        if (coverage !== null && coverage !== undefined) {
          copy.coverageId = coverage.id;
          copy.note = coverage.note;
          copy.limit = coverage.limit;
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

  backToClaimTab() {
    this.claimEventType = ClaimEventType.CLAIM;
  }

  ngBackWsib() {
    this.claimEventType = ClaimEventType.WSIB_EDIT;
    this.loadAll();
  }

  private onClaimEvent(evt: ClaimEvent): void {
    if (evt.source && evt.type === ClaimEventType.BACK) {
      this.claimEventType = ClaimEventType.WSIB_EDIT;
      this.isDeleting = false;
      this.loadAll();
      evt.type = this.claimEventType;
      return;
    }
  }
  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.editMode = true;
      this.updateForm(this.selectedWsib);
      return true;
    } else {
      this.editMode = false;
      this.updateForm(this.selectedWsib);
      return false;
    }
    this.editMode = false;
    this.updateForm(this.selectedWsib);
    return false;
  }
  private createFromForm(): Wsib {
    return {
      ...new Wsib(),
      id: this.editForm.get(['id'])!.value,
      employer: this.editForm.get(['employer'])!.value,
      claimNumber: this.editForm.get(['claimNumber'])!.value,
      supervisor: this.editForm.get(['supervisor'])!.value,
      accidentDate: this.editForm.get(['accidentDate'])!.value,
      adjudicator: this.editForm.get(['adjudicator'])!.value,
      caseManager: this.editForm.get(['caseManager'])!.value,
      status: this.editForm.get(['status'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      cellPhone: this.editForm.get(['cellPhone'])!.value,
      closeDate: this.editForm.get(['closeDate'])!.value,
      note: this.editForm.get(['note'])!.value,
      fax: this.editForm.get(['fax'])!.value,
    };
  }
}
