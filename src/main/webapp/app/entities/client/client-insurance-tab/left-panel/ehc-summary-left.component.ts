import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ehc } from 'app/entities/ehc/ehc.model';
import { Coverage } from 'app/entities/coverage/coverage.model';
import { Therapy } from 'app/entities/therapy/therapy.model';
import { InsuranceEvent, InsuranceEventType } from 'app/entities/local-share/InsuranceEvent';
import { InsuranceEventService } from 'app/entities/local-share/insurance-event.service';
import { ActivatedRoute } from '@angular/router';
import { EhcClient } from 'app/entities/ehc-client/ehc-client.model';
import { InsuranceClient } from 'app/entities/client/insurance-client.model';
import { Client } from 'app/entities/client/client.model';
import { EhcSummary } from 'app/entities/ehc/ehcSummary.model';
import { PrimaryDependent } from 'app/entities/client/primary-dependent.model';
import { EhcService } from '../../../ehc/service/ehc.service';
import { InsuranceService } from '../../../insurance/service/insurance.service';
import { NgForOf, NgIf } from '@angular/common';
const thisEventSource = 'client-insurance-tab';
@Component({
  standalone: true,
  selector: 'bc-ehc-summary-left',
  templateUrl: './ehc-summary-left.component.html',
  imports: [NgForOf, NgIf],
})
export class EhcSummaryLeftComponent implements OnInit {
  @Input()
  client!: Client;

  @Input()
  insuranceClient!: InsuranceClient;

  ehces!: Ehc[] | undefined;

  clientCoverages!: Coverage[] | undefined;

  clientTherapies!: Therapy[] | undefined;

  ehcClientPrimaries!: EhcClient[] | undefined;

  ehcSummary!: EhcSummary | undefined;

  primaries: Ehc[] | undefined = [];
  secondaries: Ehc[] | undefined = [];

  dependents: PrimaryDependent[] | undefined;

  @Output()
  secondaryEventEmitter = new EventEmitter<Ehc>();
  insuranceEventType: InsuranceEventType = InsuranceEventType.EHC;
  eventSubscription!: Subscription;
  eventSubscriber!: Subscription;
  ehcService!: EhcService;
  constructor(
    private route: ActivatedRoute,
    private insuranceService: InsuranceService,
    private insuranceEventService: InsuranceEventService,
  ) {}
  ngOnInit() {
    this.load(this.insuranceClient);
  }

  load(insuranceClient: InsuranceClient) {
    this.dependents = [];
    if (insuranceClient) {
      this.ehces = insuranceClient.ehces;
      this.clientCoverages = insuranceClient.coverages;
      this.clientTherapies = insuranceClient.therapies;
      this.ehcClientPrimaries = insuranceClient.myInsurances;
      this.ehcSummary = insuranceClient.ehcSummary;
      this.primaries = this.ehcSummary!.primaries;
      this.secondaries = this.ehcSummary!.secondaries;
      this.dependents = insuranceClient.dependents;
      this.initCoverages();
    }
  }

  ngOnEhc() {
    this.load(this.insuranceClient);
  }

  goToEhcEdit(ehc: Ehc) {
    this.insuranceEventType = InsuranceEventType.EHC_EDIT;
    this.secondaryEventEmitter.emit(ehc);
  }

  // add coverage object to list of EHC
  public getTherapyName(therapyId: any) {
    const clientTherapies: any = this.clientTherapies;
    const therapy = clientTherapies.find((p: { id: number }) => p.id === therapyId);
    if (therapy !== null && therapy !== undefined) {
      return therapy.name;
    }
    return '';
  }
  public initCoverages() {
    const copy: any = this.primaries;
    const primaries: any = this.primaries;
    const clientCoverages: any = this.clientCoverages;
    for (let i = 0; i < copy.length; i++) {
      const holder1 = [];
      for (let j = 0; j < clientCoverages.length; j++) {
        if (primaries[i].id === clientCoverages[j].ehcId) {
          holder1.push(clientCoverages[j]);
        }
      }
      primaries[i].coverages = holder1;
    }
    this.primaries = primaries;

    const copy2: any = this.secondaries;
    const secondaries: any = this.secondaries;
    for (let i = 0; i < copy2.length; i++) {
      const holder2 = [];
      for (let j = 0; j < clientCoverages.length; j++) {
        if (secondaries[i].id === clientCoverages[j].ehcId) {
          holder2.push(clientCoverages[j]);
        }
      }
      secondaries[i].coverages = holder2;
    }
    this.secondaries = secondaries;
  }

  initType(ehc: Ehc) {
    const ehcClients: any = this.ehcClientPrimaries;
    const foundEhcClient = ehcClients.find((p: { ehcId: any }) => p.ehcId === ehc.id);

    if (foundEhcClient !== undefined && foundEhcClient !== null) {
      return foundEhcClient.ehcType;
    } else {
      return '';
    }
  }

  /** ****************************************************************************
   *    Event Handler
   ** ***************************************************************************/
  onInsuranceEvent(evt: InsuranceEvent): void {
    if (evt.source && evt.source === thisEventSource) {
      this.insuranceEventType = InsuranceEventType.EHC;
      this.load(this.insuranceClient);
      return;
    }
  }

  ifHasDependent(ehc: Ehc, i: any) {
    const num = Number(i);
    if (ehc && ehc.coverages && num === ehc.coverages.length - 1) {
      return true;
    }

    return false;
  }
}
