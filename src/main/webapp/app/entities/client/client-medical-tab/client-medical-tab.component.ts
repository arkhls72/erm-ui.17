import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Client } from '../client.model';
import { MedicalEvent, MedicalEventType } from 'app/entities/local-share/medicalEvent';
import { MedicalEventService } from 'app/entities/local-share/medical-event.service';
import { MedicalClient } from 'app/entities/client/client-medical-tab/medical-client.model';
import { Condition } from 'app/entities/condition/condition.model';
import { Medication } from 'app/entities/medication/medication.model';
import { Operation } from 'app/entities/operation/operation.model';
import { Injury } from 'app/entities/injury/injury.model';
import { MedicalService } from '../../medical/service/medical.service';
import { ConditionEditComponent } from './condition-edit/condition-edit.component';
import { MedicationEditComponent } from './medication-edit/medication-edit.component';
import { InjuryEditComponent } from './injury-edit/injury-edit.component';
import { OperationEditComponent } from './operation-edit/operation-edit.component';
import { NgForOf, NgIf } from '@angular/common';
const thisEventSource = 'client-medical-tab';
@Component({
  standalone: true,
  selector: 'bc-client-medical-tab',
  templateUrl: './client-medical-tab.component.html',
  imports: [ConditionEditComponent, MedicationEditComponent, InjuryEditComponent, OperationEditComponent, NgIf, NgForOf],
})
export class ClientMedicalTabComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @Input()
  client!: Client;

  medicalClient: MedicalClient;
  injuries?: Injury[];

  conditions?: Condition[] | undefined;
  medications: Medication[] | undefined;
  operations: Operation[] | undefined;
  medication: Medication | undefined;

  medicalEventType: MedicalEventType = MedicalEventType.MEDICAL;
  eventSubscription!: Subscription;
  eventSubscriber?: Subscription;
  constructor(
    private medicalService: MedicalService,
    private route: ActivatedRoute,
    private eventService: MedicalEventService,
  ) {
    this.medicalClient = new MedicalClient();
  }

  ngOnInit() {
    this.eventSubscription = this.eventService.subscribe(this.onMedicalEvent.bind(this));
    this.load();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load() {
    const clientId: any = this.client.id;
    switch (this.medicalEventType) {
      case MedicalEventType.MEDICAL: {
        this.medicalService.findByClientId(clientId).subscribe((data: any) => {
          this.medicalClient = data.body;
          this.conditions = this.medicalClient.conditions;
          this.medications = this.medicalClient.medications;
          this.operations = this.medicalClient.operations;
          this.injuries = this.medicalClient.injuries;
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnCondition() {
    this.medicalEventType = MedicalEventType.CONDITION;
    this.load();
  }
  ngOnMedication() {
    this.medicalEventType = MedicalEventType.MEDICATION;
    this.load();
  }

  ngOnInjury() {
    this.medicalEventType = MedicalEventType.INJURY;
    this.load();
  }

  ngOnOperation() {
    this.medicalEventType = MedicalEventType.OPERATION;
    this.load();
  }

  /** ****************************************************************************
   *    Event Handler
   ** ****************************************************************************/

  backToMedicalTab() {
    this.medicalEventType = MedicalEventType.MEDICAL;
    this.load();
  }

  onMedicalEvent(evt: MedicalEvent): void {
    if (evt.source && evt.source === thisEventSource) {
      this.medicalEventType = MedicalEventType.MEDICATION;
      this.load();
      return;
    }
  }
}
