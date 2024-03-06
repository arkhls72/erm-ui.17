import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { MedicalClient } from 'app/entities/client/client-medical-tab/medical-client.model';
import { Injury } from 'app/entities/injury/injury.model';

import { MedicalEventService } from 'app/entities/local-share/medical-event.service';
import { MedicalEvent, MedicalEventType } from 'app/entities/local-share/medicalEvent';
import { HttpResponse } from '@angular/common/http';
import { Medication } from 'app/entities/medication/medication.model';
import { InjuryService } from '../../../injury/service/injury.service';
import { MedicalService } from '../../../medical/service/medical.service';
import { FormsModule } from '@angular/forms';
import { InjuryDeleteComponent } from './injury-delete/injury-delete.component';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-injury-edit',
  imports: [FormsModule, InjuryDeleteComponent, NgbInputDatepicker, NgForOf, NgIf],
  templateUrl: './injury-edit.component.html',
})
export class InjuryEditComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @Input()
  medicalClient!: MedicalClient;

  injury!: Injury;
  currentAccount: any;
  endDateDp: any;
  happenDateDp: any;
  injuries?: Injury[];
  error: any;
  success: any;
  injuryGrid: Injury = {} as Injury;
  isSaving?: boolean;
  selectedInjury?: Injury;
  selectedIndex?: number;
  isDeleting = false;
  eventSubscription!: Subscription;
  medicalEventType?: MedicalEventType = MedicalEventType.INJURY;
  constructor(
    private injuryService: InjuryService,
    private medicalService: MedicalService,
    private eventService: MedicalEventService,
  ) {}
  ngOnInit() {
    this.eventSubscription = this.eventService.subscribe(this.onMedicalEvent.bind(this));
    this.isSaving = false;
    this.isDeleting = false;

    this.loadAll();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAll() {
    const medicalClient: any = this.medicalClient;
    switch (this.medicalEventType) {
      case MedicalEventType.INJURY:
        this.injuryService
          .findByClientId(medicalClient.clientId)
          .subscribe((res: HttpResponse<Injury[]>) => (this.injuries = res.body || []));
        break;

      default:
        break;
    }
  }

  addRow() {
    // const today  = moment(new Date(), 'DD/MM/YYYY");
    const injuries: any = this.injuries; // this.injuryGrid = {nameType: '' , happenDate: moment(1),note:};
    const nameType: any = { nameType: '', note: '' };
    this.injuryGrid = nameType;
    injuries.push(this.injuryGrid);
    this.injuries = injuries;
    return true;
  }

  save(i: number) {
    const injuries: any = this.injuries;
    const selectedInjury = injuries[i];
    const medicalClient: any = this.medicalClient;
    this.isSaving = true;
    if (selectedInjury !== undefined && selectedInjury.id !== undefined && selectedInjury.id !== null) {
      this.subscribeToSaveResponse(this.injuryService.update(selectedInjury));
    } else if (this.ifSelectedRowCreated(selectedInjury)) {
      this.subscribeToSaveResponse(this.injuryService.createForClient(selectedInjury, medicalClient.clientId));
    } else {
      return false;
    }
    return false;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Injury>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      err => this.onSaveError(err),
    );
  }

  private onSaveError(error: any) {
    this.isSaving = false;
    let selectedIndex: any = this.selectedIndex;
    selectedIndex = null;
    this.selectedIndex = selectedIndex;
    this.onError(error);
  }

  private onSaveSuccess() {
    this.isSaving = false;
    this.isDeleting = false;
    this.loadAll();
  }

  deleteRow(i: number) {
    const injuries: any = this.injuries;
    if (injuries.length === 0) {
      return false;
    }

    this.selectedInjury = injuries[i];
    if (
      this.selectedInjury === null ||
      this.selectedInjury === undefined ||
      this.selectedInjury.id === null ||
      this.selectedInjury.id === undefined
    ) {
      injuries.splice(i, 1);
      this.injuries = injuries;
      return true;
    }
    const isSelectedRowCreated = this.ifSelectedRowCreated(this.selectedInjury);
    if (!isSelectedRowCreated) {
      injuries.splice(i, 1);
      this.injuries = injuries;
      return true;
    }

    if (!this.isDeleting && isSelectedRowCreated) {
      this.isDeleting = true;
      this.selectedIndex = i;
      this.injury = this.selectedInjury;
      this.medicalEventType = MedicalEventType.INJURY_DELETE;
      this.loadAll();
    }
    return false;
  }

  protected subscribeToDeleteResponse(result: Observable<HttpResponse<Medication>>): void {
    result.subscribe(
      () => this.onDeleteSuccess(),
      err => this.onError(err),
    );
  }

  private onError(error: any) {
    this.isDeleting = false;
  }

  private onDeleteSuccess() {
    const injuries: any = this.injuries;
    let selectedIndex: any = this.selectedIndex;
    this.isDeleting = false;
    injuries.splice(this.selectedIndex, 1);
    this.injuries = injuries;
    selectedIndex = null;
    this.selectedIndex = selectedIndex;
  }

  private ifSelectedRowCreated(selectedInjury: Injury) {
    if (
      selectedInjury !== null &&
      selectedInjury !== undefined &&
      selectedInjury.nameType !== '' &&
      selectedInjury.nameType !== undefined &&
      selectedInjury.nameType !== '' &&
      selectedInjury.nameType !== undefined
    ) {
      return true;
    }

    return false;
  }

  /** ****************************************************************************
   *    Event Handler
   ** ****************************************************************************/
  private onMedicalEvent(evt: MedicalEvent): void {
    if (evt.source && evt.type === MedicalEventType.BACK) {
      this.medicalEventType = MedicalEventType.INJURY;
      this.isDeleting = false;
      this.loadAll();
      evt.type = this.medicalEventType;
      return;
    }
  }
}
