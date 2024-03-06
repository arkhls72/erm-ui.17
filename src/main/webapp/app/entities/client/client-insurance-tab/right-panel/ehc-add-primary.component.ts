import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { EhcClient } from '../../../ehc-client/ehc-client.model';
import { Ehc } from 'app/entities/ehc/ehc.model';
import { InsuranceEvent, InsuranceEventType } from 'app/entities/local-share/InsuranceEvent';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from 'app/entities/client/client.model';
import { EhcService } from '../../../ehc/service/ehc.service';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-ehc-add-primary',
  templateUrl: './ehc-add-primary.component.html',
  imports: [ReactiveFormsModule, NgIf, NgForOf],
})
export class EhcAddPrimaryComponent implements OnInit {
  editMode = false;

  @Output()
  eventEmitter = new EventEmitter();

  @Output()
  addPrimaryEventEmitter = new EventEmitter<Ehc>();

  @Input()
  ehc!: Ehc;

  @Input()
  client!: Client;
  currentAccount: any;
  secondaryEhcClients!: EhcClient[];
  error: any;
  endDateDp: any;
  success: any;
  routeData: any;
  isSaving!: boolean;
  eventSubscriber!: Subscription;
  insuranceEventType: InsuranceEventType = InsuranceEventType.EHC_ADD_PRIMARY;
  statuses!: string[];
  ehcTypes!: string[];

  editForm = this.fb.group({
    id: [],
    certificateNumber: [null, [Validators.required, Validators.maxLength(50)]],
    policyNumber: [null, [Validators.required, Validators.maxLength(50)]],
    groupNumber: [null, [Validators.maxLength(50)]],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    status: [null, [Validators.maxLength(15)]],
    type: [null, [Validators.maxLength(15)]],
  });
  constructor(
    private ehcService: EhcService,
    private fb: FormBuilder,
  ) {
    if (!this.ehc) {
      this.ehc = {} as Ehc;
    }
    this.initListBox();
    this.updateForm(this.ehc);
  }

  ngOnInit() {
    this.isSaving = false;
    this.loadAll();
  }

  loadAll() {
    if (this.ehc.id !== null && this.ehc.id !== undefined) {
      this.ehcService.find(this.ehc.id).subscribe(res => {
        const ehc: any = res.body;
        this.ehc = ehc;
      });
    }
  }
  trackId(index: number, item: Ehc) {
    return item.id;
  }

  onSave() {
    this.ehc = this.createFromForm();
    this.ehc.clientId = this.client.id;
    this.ehc.status = 'Active';
    this.subscribeToSaveResponse(this.ehcService.createForClient(this.ehc, this.client.id));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Ehc>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(result: HttpResponse<Ehc>): void {
    this.isSaving = false;
    const ehc: Ehc | null = result.body;
    if (ehc) {
      this.ehc = ehc;
      const addPrimartEvent = new InsuranceEvent();
      addPrimartEvent.ehc = ehc;
      addPrimartEvent.type = this.insuranceEventType;
      this.addPrimaryEventEmitter.emit(this.ehc);
    }
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  private onError() {
    this.isSaving = false;
  }

  changeStatus(event: Event) {
    this.ehc.status = this.findElementStringValue(event);
  }

  private findElementStringValue(e: Event) {
    return (e.target as HTMLInputElement).value;
  }
  initListBox() {
    this.statuses = [];
    this.statuses.push('Active');
    this.statuses.push('Inactive');

    this.ehcTypes = [];
    this.ehcTypes.push('Primary');
    this.ehcTypes.push('Secondary');
  }

  backToEhc() {
    this.eventEmitter.emit();
  }
  checkEditMode(checked: Boolean) {
    this.editMode = checked ? true : false;
  }

  updateForm(ehc: any): void {
    const type: any = 'Primary';
    this.editForm.patchValue({
      id: ehc.id,
      certificateNumber: ehc.certificateNumber,
      policyNumber: ehc.policyNumber,
      groupNumber: ehc.groupNumber,
      name: ehc.name,
      status: ehc.status,
      type: type,
    });
  }

  private createFromForm(): Ehc {
    const ehc = {} as Ehc;

    (ehc.id = this.editForm.get(['id'])!.value),
      (ehc.certificateNumber = this.editForm.get(['certificateNumber'])!.value),
      (ehc.policyNumber = this.editForm.get(['policyNumber'])!.value),
      (ehc.groupNumber = this.editForm.get(['groupNumber'])!.value),
      (ehc.name = this.editForm.get(['name'])!.value),
      (ehc.status = this.editForm.get(['status'])!.value),
      (ehc.type = 'Primary');

    return ehc;
  }
}
