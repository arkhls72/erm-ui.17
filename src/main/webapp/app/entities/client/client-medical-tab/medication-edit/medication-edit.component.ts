import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

import { MedicalClient } from 'app/entities/client/client-medical-tab/medical-client.model';
import { Medication } from 'app/entities/medication/medication.model';
import { MedicalEventService } from 'app/entities/local-share/medical-event.service';

import { MedicalEvent, MedicalEventType } from 'app/entities/local-share/medicalEvent';
import { HttpResponse } from '@angular/common/http';
import { MedicationDeleteComponent } from './medication-delete/medication-delete.component';
import { MedicationService } from '../../../medication/service/medication.service';
import { MedicalService } from '../../../medical/service/medical.service';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { FormsModule } from '@angular/forms';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NgForOf, NgIf } from '@angular/common';
@Component({
  standalone: true,
  selector: 'bc-medication-edit',
  templateUrl: './medication-edit.component.html',
  imports: [MedicationDeleteComponent, FormsModule, NgbInputDatepicker, NgForOf, NgIf],
})
export class MedicationEditComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @Input()
  medicalClient!: MedicalClient;

  @Input()
  medication!: Medication;

  currentAccount: any;
  endDateDp: any;
  startDateDp: any;
  medications?: Medication[];
  error: any;
  success: any;
  itemsPerPage: any;
  medicationGrid: Medication = {} as Medication;
  isSaving?: boolean;
  selectedMedication?: Medication;
  selectedIndex?: number;
  isDeleting = false;
  eventSubscription!: Subscription;
  medicalEventType?: MedicalEventType = MedicalEventType.MEDICATION;
  constructor(
    private medicationService: MedicationService,
    private medicalService: MedicalService,
    private eventService: MedicalEventService,
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
  }

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
      case MedicalEventType.MEDICATION:
        this.medicationService
          .findByClientId(medicalClient.clientId)
          .subscribe((res: HttpResponse<Medication[]>) => (this.medications = res.body || []));
        break;

      default:
        break;
    }
  }
  trackId(index: number, item: Medication) {
    return item.id;
  }

  addRow() {
    const grid: any = { name: '', reasonFor: '', note: '' };
    this.medicationGrid = grid;
    const medications: any = this.medications;
    medications.push(this.medicationGrid);
    this.medications = medications;
    return true;
  }

  save(i: any) {
    const medications: any = this.medications;
    const selectedMedication = medications[i];
    const medicalClient: any = this.medicalClient;
    this.isSaving = true;
    if (selectedMedication !== undefined && selectedMedication.id !== undefined && selectedMedication.id !== null) {
      this.subscribeToSaveResponse(this.medicationService.update(selectedMedication));
    } else if (this.ifSelectedRowCreated(selectedMedication)) {
      this.subscribeToSaveResponse(this.medicationService.createForClient(selectedMedication, medicalClient.clientId));
    } else {
      return false;
    }

    return false;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Medication>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      err => this.onSaveError(err),
    );
  }

  private onSaveSuccess() {
    this.isSaving = false;
    this.isDeleting = false;
    this.loadAll();
  }

  deleteRow(i: number) {
    const medications: any = this.medications;
    if (medications.length === 0) {
      return false;
    }

    this.selectedMedication = medications[i];
    if (
      this.selectedMedication === null ||
      this.selectedMedication === undefined ||
      this.selectedMedication.id === null ||
      this.selectedMedication.id === undefined
    ) {
      medications.splice(i, 1);
      this.medications = medications;
      return true;
    }
    const isSelectedRowCreated = this.ifSelectedRowCreated(this.selectedMedication);
    if (!isSelectedRowCreated) {
      medications.splice(i, 1);
      this.medications = medications;
      return true;
    }

    if (!this.isDeleting && isSelectedRowCreated) {
      const deletedMedication: any = this.selectedMedication;
      this.isDeleting = true;
      this.selectedIndex = i;
      this.medication = deletedMedication;
      this.medicalEventType = MedicalEventType.MEDICATION_DELETE;
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

  private onDeleteSuccess() {
    const medications: any = this.medications;
    let selectedIndex: any = this.selectedIndex;
    this.isDeleting = false;

    medications.splice(this.selectedIndex, 1);
    this.medications = medications;
    selectedIndex = null;
    this.selectedIndex = selectedIndex;
  }

  private onSaveError(error: any) {
    this.isSaving = false;
    let selectedIndex: any = this.selectedIndex;
    selectedIndex = null;
    this.selectedIndex = selectedIndex;
    this.onError(error);
  }

  private onError(error: any) {
    this.isDeleting = false;
  }

  private ifSelectedRowCreated(selectedMedication: Medication) {
    if (
      selectedMedication !== null &&
      selectedMedication !== undefined &&
      selectedMedication.name !== '' &&
      selectedMedication.name !== undefined &&
      selectedMedication.reasonFor !== '' &&
      selectedMedication.reasonFor !== undefined
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
      this.medicalEventType = MedicalEventType.MEDICATION;
      this.isDeleting = false;
      this.loadAll();
      evt.type = this.medicalEventType;
      return;
    }
  }
}
