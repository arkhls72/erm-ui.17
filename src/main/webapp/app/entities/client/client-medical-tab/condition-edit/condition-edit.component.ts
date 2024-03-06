import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MedicalClient } from 'app/entities/client/client-medical-tab/medical-client.model';
import { Condition } from 'app/entities/condition/condition.model';
import { MedicalEventService } from 'app/entities/local-share/medical-event.service';
import { Medical } from 'app/entities/medical/medical.model';
import { HttpResponse } from '@angular/common/http';
import { ConditionLeftComponent } from 'app/entities/client/client-medical-tab/condition-edit/left/condition-left.component';
import { ConditionRightComponent } from 'app/entities/client/client-medical-tab/condition-edit/right/condition-right.component';
import { MedicalCondition } from 'app/entities/medical/medicalCondition.model';
import { ConditionService } from '../../../condition/service/condition.service';
import { MedicalService } from '../../../medical/service/medical.service';

@Component({
  standalone: true,
  selector: 'bc-condition-edit',
  templateUrl: './condition-edit.component.html',
  imports: [ConditionRightComponent, ConditionLeftComponent],
})
export class ConditionEditComponent implements OnInit {
  @ViewChild(ConditionLeftComponent) conditionLeftComponent!: ConditionLeftComponent;
  @ViewChild(ConditionRightComponent) conditionRightComponent!: ConditionRightComponent;

  @Input()
  medicalClient!: MedicalClient;

  @Output()
  leftEventEmitter = new EventEmitter<number[]>();
  conditionIds?: number[] = [];
  medical?: Medical;
  // The list that is iterated and being displayed in UI
  defaultConditions: Condition[] = [];

  rightCondition: Condition[] = [];
  leftCondition: Condition[] = [];

  // comes from MedicalClient and contains the list of notes as well.
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
    // this.eventSubscription = this.medicalEventService.subscribe(this.onMedicalEvent.bind(this));
    this.loadAll();
  }

  loadAll() {
    this.clientConditions = this.medicalClient.conditions;
    // retrieve all conditions
    this.conditionService.query().subscribe((res: HttpResponse<Condition[]>) => this.onSuccess(res.body));
  }
  protected onSuccess(data: Condition[] | null): void {
    this.defaultConditions = data || [];
    this.initRightLeftConditionList();
  }

  private initRightLeftConditionList() {
    if (this.defaultConditions) {
      for (let i = 0; i < this.defaultConditions.length; i++) {
        if (i % 2 === 0) {
          this.leftCondition.push(this.defaultConditions[i]);
        } else {
          this.rightCondition.push(this.defaultConditions[i]);
        }
      }
    }
  }

  save() {
    this.conditionIds = [];
    this.conditionRightComponent.ifChecked();
    this.conditionLeftComponent.ifChecked();
    const medicalCondition: MedicalCondition = new MedicalCondition();
    medicalCondition.clientId = this.medicalClient.clientId;
    medicalCondition.conditionIds = this.conditionIds;
    this.subscribeToSaveResponse(this.medicalService.createByConditionIds(medicalCondition));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<MedicalClient>>): void {
    result.subscribe(
      resp => this.onSaveSuccess(resp.body),
      e => this.onSaveError(e),
    );
  }

  private onSaveSuccess(result: MedicalClient | null) {
    this.clientConditions = result?.conditions;
    this.medicalClient.conditions = this.clientConditions;
  }

  protected onSaveError(e: any): void {
    this.isSaving = false;
  }

  leftCheck(leftConditionIds: number[]) {
    if (leftConditionIds && leftConditionIds.length > 0) {
      if (!this.conditionIds) {
        this.conditionIds = [];
      }
      leftConditionIds.forEach(it => {
        this.conditionIds!.push(it);
      });
    }
  }
  rightCheck(rightConditionIds: number[]) {
    if (rightConditionIds && rightConditionIds.length > 0) {
      if (!this.conditionIds) {
        this.conditionIds = [];
      }
      rightConditionIds.forEach(it => {
        this.conditionIds!.push(it);
      });
    }
  }
}
