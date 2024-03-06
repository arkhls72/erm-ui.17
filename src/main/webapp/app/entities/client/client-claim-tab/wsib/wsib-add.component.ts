import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ClaimEventType } from 'app/entities/local-share/claim-event';
import { Wsib } from 'app/entities/wsib/wsib.model';
import { HttpResponse } from '@angular/common/http';
import { Client } from 'app/entities/client/client.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WsibService } from '../../../wsib/service/wsib.service';
import dayjs from 'dayjs/esm';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-wsib-add',
  templateUrl: './wsib-add.component.html',
  imports: [ReactiveFormsModule, FaIconComponent, NgbInputDatepicker, NgForOf, NgIf],
})
export class WsibAddComponent implements OnInit {
  editMode = false;
  accidentDateDp: any;
  claimEventType: ClaimEventType = ClaimEventType.WSIB_ADD;
  statuses!: string[];

  @Output()
  saveWsibSuccessEmitter = new EventEmitter<Wsib>();

  wsib = new Wsib();

  @Input()
  client?: Client;

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
    email: [null, [Validators.maxLength(50)]],
    cellPhone: [null, [Validators.maxLength(15)]],
    closeDate: [],
    note: [null, [Validators.maxLength(350)]],
    fax: [null, [Validators.maxLength(12)]],
  });
  constructor(
    private wsibService: WsibService,
    private fb: FormBuilder,
  ) {
    this.initListBox();
  }

  ngOnInit() {
    this.wsib.accidentDate = dayjs(new Date(), 'DD/MM/YYYY');
  }

  save() {
    if (this.client) {
      const wsib = this.createFromForm();
      wsib.clientId = this.client.id;
      this.subscribeToSaveResponse(this.wsibService.createForClient(wsib, this.client.id));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Wsib>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body));
  }

  protected onSaveSuccess(wsib: Wsib | null): void {
    if (wsib) {
      this.saveWsibSuccessEmitter.emit(wsib);
    }
  }

  initListBox() {
    this.statuses = [];
    this.statuses.push('Open');
    this.statuses.push('Close');
    this.statuses.push('InProgress');
  }

  ngOnAddWsib() {
    this.wsib = new Wsib();
    this.claimEventType = ClaimEventType.WSIB_ADD;
  }

  private findElementStringValue(e: Event) {
    return (e.target as HTMLInputElement).value;
  }

  backToClaimTab() {
    this.claimEventType = ClaimEventType.CLAIM;
  }

  ngBackWsib() {
    this.claimEventType = ClaimEventType.WSIB_ADD;
  }

  checkEditMode(checked: Boolean) {
    if (checked) {
      this.editMode = true;
      return true;
    } else {
      this.editMode = false;
      return false;
    }
    this.editMode = false;
    return false;
  }

  updateForm(wsib: any): void {
    this.editForm.patchValue({
      id: wsib.id,
      employer: wsib.employer,
      claimNumber: wsib.claimNumber,
      clientId: wsib.clientId,
      supervisor: wsib.supervisor,
      accidentDate: wsib.accidentDate,
      adjudicator: wsib.adjudicator,
      caseManager: wsib.caseManager,
      status: wsib.status,
      phone: wsib.phone,
      cellPhone: wsib.cellPhone,
      closeDate: wsib.closeDate,
      note: wsib.note,
      fax: wsib.fax,
    });
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
