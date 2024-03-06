import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Ehc } from 'app/entities/ehc/ehc.model';
import { EhcClient } from 'app/entities/ehc-client/ehc-client.model';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { EhcPrimary } from 'app/entities/ehc-primary/ehc-primary.model';
import { EhcService } from '../../../ehc/service/ehc.service';
import { EhcClientService } from '../../../ehc-client/service/ehc-client.service';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT, DATE_TIME_FORMAT } from '../../../../config/input.constants';

@Component({
  standalone: true,
  selector: 'bc-ehc-secondary-edit',
  templateUrl: './ehc-secondary-edit.component.html',
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgForOf],
})
export class EhcSecondaryEditComponent implements OnInit {
  editMode = false;

  statuses!: string[];
  primary!: EhcPrimary;

  @Input()
  secondary!: EhcClient;

  @Output()
  cancelSecondaryEmitter = new EventEmitter();

  selectedIndex!: number;

  isSecondaryCoverage!: boolean;

  primaryEditForm = this.fb.group({
    id: [],
    certificateNumber: [null, [Validators.maxLength(50)]],
    policyNumber: [null, [Validators.maxLength(50)]],
    policyHolder: [null, [Validators.maxLength(50)]],
    groupNumber: [null, [Validators.maxLength(50)]],
    name: [null, [Validators.maxLength(50)]],
    note: [null, [Validators.maxLength(350)]],
    status: [null, [Validators.maxLength(15)]],
    endDate: [],
    type: [],
    lastModifiedDate: [],
  });
  secondaryEditForm = this.fb.group({
    id: [],
    note: [null, [Validators.maxLength(350)]],
    relation: [null, [Validators.maxLength(15)]],
    status: [],
    ehcId: [],
    clientId: [],
    createdDate: [],
    lastModifiedDate: [],
  });
  constructor(
    private ehcService: EhcService,
    private datePipe: DatePipe,
    private ehcClientService: EhcClientService,
    private fb: FormBuilder,
  ) {
    this.initListBox();
  }

  ngOnInit() {
    if (this.secondary) {
      this.updateSecondaryForm(this.secondary);
      if (this.secondary.primary) {
        this.primary = this.secondary.primary;
        this.updatePrimaryForm(this.primary);
      }
    }
  }

  updatePrimaryForm(primary: any): void {
    const date = dayjs(primary.lastModifiedDate);
    primary.lastModifiedDate = date;
    if (primary) {
      this.primaryEditForm.patchValue({
        id: primary.id,
        certificateNumber: primary.certificateNumber,
        policyNumber: primary.policyNumber,
        policyHolder: primary.policyHolder,
        groupNumber: primary.groupNumber,
        name: primary.name,
        note: primary.note,
        status: primary.status,
        type: primary.ehcType,
        endDate: this.editMode ? primary.endDate : this.datePipe.transform(primary.endDate, 'yyyy-MM-dd')!,
        lastModifiedDate: primary.lastModifiedDate ? primary.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      });
    }
  }
  updateSecondaryForm(secondary: EhcClient) {
    const copy: any = secondary;
    const modifeid = dayjs(secondary.lastModifiedDate);
    secondary.lastModifiedDate = modifeid;

    const created = dayjs(secondary.createdDate);
    secondary.createdDate = created;

    if (copy) {
      const ehcId: any = copy.ehcId;
      this.secondaryEditForm.patchValue({
        id: copy.id,
        note: copy.note,
        relation: copy.relation,
        ehcId: ehcId,
        clientId: copy.clientId,
        status: copy.status,
        lastModifiedDate: copy.lastModifiedDate ? copy.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
        createdDate: copy.createdDate ? copy.createdDate.format(DATE_FORMAT) : undefined,
      });
    }
  }

  private createSecondaryForm(): EhcClient {
    const ehcClient = {} as EhcClient;
    (ehcClient.id = this.secondary.id),
      (ehcClient.ehcId = this.secondary.ehcId),
      (ehcClient.ehcType = this.secondary.ehcType),
      (ehcClient.clientId = this.secondary.clientId),
      (ehcClient.status = this.secondaryEditForm.get(['status'])!.value),
      (ehcClient.note = this.secondaryEditForm.get(['note'])!.value),
      (ehcClient.relation = this.secondaryEditForm.get(['relation'])!.value);

    return ehcClient;
  }
  saveSecondary() {
    const secondary: EhcClient = this.createSecondaryForm();
    secondary.status = this.secondary.status;
    this.subscribeToSaveResponse(this.ehcClientService.update(secondary));
    return false;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<EhcClient>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body));
  }

  protected onSaveSuccess(resp?: EhcClient | null): void {
    if (resp instanceof Ehc) {
      this.secondary = resp;
      this.updateSecondaryForm(resp);
    }
  }

  changeStatus(ehc?: Ehc, event?: Event) {
    this.primary.status = this.findElementStringValue(event);
  }

  changeSecondaryStatus(secondary?: EhcClient, event?: Event) {
    this.secondary.status = this.findElementStringValue(event);
  }

  initListBox() {
    this.statuses = [];
    this.statuses.push('Active');
    this.statuses.push('Inactive');
  }

  private findElementStringValue(e: Event | undefined) {
    if (e) {
      return (e.target as HTMLInputElement).value;
    }
    return '';
  }

  backToEhc() {}

  initSelectedEhc(selectedEhc?: Ehc) {
    if (selectedEhc instanceof Ehc) {
      this.primary = selectedEhc;
    }
  }

  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    this.editMode = target.checked ? true : false;

    return this.editMode;
  }
}
