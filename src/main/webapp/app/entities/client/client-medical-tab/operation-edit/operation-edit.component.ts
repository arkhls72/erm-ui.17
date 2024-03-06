import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

import { MedicalClient } from 'app/entities/client/client-medical-tab/medical-client.model';
import { Operation } from 'app/entities/operation/operation.model';
import { MedicalEventService } from 'app/entities/local-share/medical-event.service';
import { MedicalEvent, MedicalEventType } from 'app/entities/local-share/medicalEvent';
import { HttpResponse } from '@angular/common/http';
import { Medication } from 'app/entities/medication/medication.model';
import { OperationService } from '../../../operation/service/operation.service';
import { MedicalService } from '../../../medical/service/medical.service';
import { FormsModule } from '@angular/forms';
import { OperationDeleteComponent } from './operation-delete/operation-delete.component';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NgForOf, NgIf } from '@angular/common';
@Component({
  standalone: true,
  selector: 'bc-operation-edit',
  imports: [FormsModule, OperationDeleteComponent, NgbInputDatepicker, NgForOf, NgIf],
  templateUrl: './operation-edit.component.html',
})
export class OperationEditComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @Input()
  medicalClient!: MedicalClient;

  operation!: Operation;
  currentAccount: any;
  endDateDp: any;
  operationDateDp: any;
  operations?: Operation[];
  error: any;
  success: any;
  operationGrid: Operation = {} as Operation;
  isSaving?: boolean;
  selectedOperation?: Operation;
  selectedIndex?: number;
  isDeleting = false;
  eventSubscription!: Subscription;
  medicalEventType?: MedicalEventType = MedicalEventType.OPERATION;

  constructor(
    private operationService: OperationService,
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
      case MedicalEventType.OPERATION:
        this.operationService
          .findByClientId(medicalClient.clientId)
          .subscribe((res: HttpResponse<Operation[]>) => (this.operations = res.body || []));
        break;

      default:
        break;
    }
  }

  addRow() {
    const operations: any = this.operations;
    const grid: any = { name: '', reasonFor: '', note: '' };
    this.operationGrid = grid;
    operations.push(this.operationGrid);
    this.operations = operations;
    return true;
  }

  save(i: number) {
    const operations: any = this.operations;
    const selectedOperation = operations[i];
    const medicalClient: any = this.medicalClient;
    this.isSaving = true;
    if (selectedOperation !== undefined && selectedOperation.id !== undefined && selectedOperation.id !== null) {
      this.subscribeToSaveResponse(this.operationService.update(selectedOperation));
    } else if (this.ifSelectedRowCreated(selectedOperation)) {
      this.subscribeToSaveResponse(this.operationService.createForClient(selectedOperation, medicalClient.clientId));
    } else {
      return false;
    }
    return false;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Operation>>): void {
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
    const operations: any = this.operations;
    if (operations.length === 0) {
      return false;
    }

    this.selectedOperation = operations[i];
    if (
      this.selectedOperation === null ||
      this.selectedOperation === undefined ||
      this.selectedOperation.id === null ||
      this.selectedOperation.id === undefined
    ) {
      operations.splice(i, 1);
      this.operations = operations;
      return true;
    }
    const isSelectedRowCreated = this.ifSelectedRowCreated(this.selectedOperation);
    if (!isSelectedRowCreated) {
      operations.splice(i, 1);
      this.operations = operations;
      return true;
    }
    if (!this.isDeleting && isSelectedRowCreated) {
      this.isDeleting = true;
      this.selectedIndex = i;
      this.operation = this.selectedOperation;
      this.medicalEventType = MedicalEventType.OPERATION_DELETE;
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
    const operations: any = this.operations;
    const selectedIndex: any = this.selectedIndex;
    this.isDeleting = false;

    operations.splice(this.selectedIndex, 1);
    this.operations = operations;
    this.selectedIndex = selectedIndex;
  }
  private onSaveError(error: any) {
    this.isSaving = false;
    const selectedIndex: any = null;
    this.selectedIndex = selectedIndex;
  }

  private ifSelectedRowCreated(selectedOperation: Operation) {
    if (
      selectedOperation !== null &&
      selectedOperation !== undefined &&
      selectedOperation.name !== '' &&
      selectedOperation.name !== undefined &&
      selectedOperation.name !== '' &&
      selectedOperation.name !== undefined
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
      this.medicalEventType = MedicalEventType.OPERATION;
      this.isDeleting = false;
      evt.type = this.medicalEventType;
      this.loadAll();
      return;
    }
  }
}
