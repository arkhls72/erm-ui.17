import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { MedicalClient } from 'app/entities/client/client-medical-tab/medical-client.model';
import { Condition } from 'app/entities/condition/condition.model';
import { MedicalEventService } from 'app/entities/local-share/medical-event.service';
import { MedicalEventType } from 'app/entities/local-share/medicalEvent';
import { ConditionService } from '../../../../condition/service/condition.service';
import { MedicalService } from '../../../../medical/service/medical.service';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-condition-right',
  templateUrl: './condition-right.component.html',
  imports: [NgIf, NgForOf],
})
export class ConditionRightComponent implements OnInit {
  @Input()
  medicalClient?: MedicalClient;

  @Output()
  rightEventEmitter = new EventEmitter<number[]>();

  addConditionIds?: number[];

  @Input()
  rightConditions?: Condition[];

  clientConditions: Condition[] | undefined = [];
  isSaving = false;
  emptyString: string | undefined;
  selectedSwitch: boolean;
  eventSubscriber: Subscription = new Subscription();
  eventSubscription: Subscription = new Subscription();

  constructor(
    private conditionService: ConditionService,
    private medicalService: MedicalService,
    private medicalEventService: MedicalEventService,
  ) {
    this.selectedSwitch = false;
  }

  ngOnInit() {
    this.clientConditions = this.medicalClient?.conditions;
  }

  isSelected(id: any): boolean {
    // const elementNote = document.getElementById('field_note_'+index) as HTMLInputElement;
    if (this.clientConditions !== undefined) {
      return this.clientConditions.some(item => item.id === id);
    }
    return false;
  }

  showSelected(e: Event) {
    this.selectedSwitch = e ? true : false;
  }

  ifChecked() {
    this.addConditionIds = [];
    this.rightConditions?.forEach(p => {
      const found: boolean | undefined = this.clientConditions!.some(item => item.id === p.id);
      if (found) {
        const x: number = p.id!;
        this.addConditionIds?.push(x);
      }
    });
    this.rightEventEmitter.emit(this.addConditionIds);
  }
  addOrRemoveCondition(cond: Condition, event: Event) {
    const target = event.target as HTMLInputElement;
    const eventType: MedicalEventType = target.checked ? MedicalEventType.SELECTED : MedicalEventType.UNSELECTED;
    switch (eventType) {
      case MedicalEventType.UNSELECTED: {
        const filteredConditions: Condition[] = this.clientConditions!.filter(p => p.id !== cond.id);
        this.clientConditions = filteredConditions;
        break;
      }

      case MedicalEventType.SELECTED: {
        const findCondition: Condition | undefined = this.rightConditions!.find(item => item.id === cond.id);
        if (findCondition) {
          this.clientConditions?.push(findCondition);
        }
        break;
      }

      default:
        break;
    }
  }
}
