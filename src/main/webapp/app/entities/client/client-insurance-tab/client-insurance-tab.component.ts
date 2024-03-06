import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { Client } from '../client.model';
import { InsuranceClient } from '../insurance-client.model';
import { Ehc } from 'app/entities/ehc/ehc.model';
import { Coverage } from 'app/entities/coverage/coverage.model';
import { Therapy } from 'app/entities/therapy/therapy.model';
import { InsuranceEventType } from 'app/entities/local-share/InsuranceEvent';
import { ActivatedRoute } from '@angular/router';
import { EhcClient } from 'app/entities/ehc-client/ehc-client.model';
import { HttpResponse } from '@angular/common/http';
import { EhcSummaryLeftComponent } from 'app/entities/client/client-insurance-tab/left-panel/ehc-summary-left.component';
import { EhcEditComponent } from 'app/entities/client/client-insurance-tab/right-panel/ehc-edit.component';
import { EhcPrimary } from 'app/entities/ehc-primary/ehc-primary.model';
import { EhcService } from '../../ehc/service/ehc.service';
import { InsuranceService } from '../../insurance/service/insurance.service';
import { EhcListComponent } from './right-panel/ehc-list.component';
import { EhcAddPrimaryComponent } from './right-panel/ehc-add-primary.component';
import { EhcCoverageComponent } from './right-panel/ehc-coverage.component';
import { EhcAddressComponent } from './right-panel/ehc-address.component';
import { EhcSecondaryAddComponent } from './right-panel/ehc-secondary-add.component';
import { EhcDeleteComponent } from './right-panel/ehc-delete.component';
import { EhcSecondaryEditComponent } from './right-panel/ehc-secondary-edit.component';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-client-insurance-tab',
  templateUrl: './client-insurance-tab.component.html',
  imports: [
    EhcSummaryLeftComponent,
    EhcListComponent,
    EhcEditComponent,
    EhcAddPrimaryComponent,
    EhcCoverageComponent,
    EhcAddressComponent,
    EhcSecondaryAddComponent,
    EhcDeleteComponent,
    EhcSecondaryEditComponent,
    NgIf,
  ],
})
export class ClientInsuranceTabComponent implements OnInit {
  @ViewChild(EhcSummaryLeftComponent) summaryLeftComponent!: EhcSummaryLeftComponent;
  @ViewChild(EhcEditComponent) childEhcEditComponent!: EhcEditComponent;
  @Input()
  client!: Client;

  // add primary
  selectedEhc = {} as Ehc;
  ehces!: Ehc[];

  // add secondary
  secondaryEhcClients!: EhcClient[];
  ehcClient!: EhcClient;

  insuranceClient!: InsuranceClient;
  selectedSecondary!: EhcClient;
  clientCoverages!: Coverage[];
  clientTherapies!: Therapy[];
  ehcClients!: EhcClient;
  ehcEventType: InsuranceEventType = InsuranceEventType.EHC;
  eventSubscription!: Subscription;
  eventSubscriber!: Subscription;
  ehcService!: EhcService;

  constructor(
    private route: ActivatedRoute,
    private insuranceService: InsuranceService,
  ) {}
  ngOnInit() {
    this.load();
  }

  load() {
    switch (this.ehcEventType) {
      case InsuranceEventType.EHC: {
        this.loadInsuranceClient();
        break;
      }
      default: {
        break;
      }
    }
  }

  afterPrimaryAdded(ehc?: Ehc) {
    if (ehc) {
      this.selectedEhc = ehc;
      this.ehcEventType = InsuranceEventType.EHC_EDIT;
      this.loadInsuranceClient();
    }
  }
  ngOnEhc() {
    this.ehcEventType = InsuranceEventType.EHC;
  }

  goToEhcEdit(ehc?: Ehc) {
    if (ehc) {
      this.selectedEhc = ehc;
      if (this.ehcEventType !== InsuranceEventType.EHC_EDIT) {
        this.ehcEventType = InsuranceEventType.EHC_EDIT;
      } else {
        this.childEhcEditComponent.runLoadFromParent(ehc);
      }
    }
  }

  public getTherapyName(therapyId: any) {
    const clientTherapies: any = this.clientTherapies;
    const therapy = clientTherapies.find((p: { id: number }) => p.id === therapyId);
    if (therapy !== null && therapy !== undefined) {
      return therapy.name;
    }
    return '';
  }
  public initCoverages() {
    const copy: any = this.ehces;
    const ehces: any = this.ehces;
    const clientCoverages: any = this.clientCoverages;
    for (let i = 0; i < copy.length; i++) {
      const holder = [];
      for (let j = 0; j < clientCoverages.length; j++) {
        if (ehces[i].id === clientCoverages[j].ehcId) {
          holder.push(clientCoverages[j]);
        }
      }
      ehces[i].coverages = holder;
    }
    this.ehces = ehces;
  }

  initType(ehc: Ehc) {
    const ehcClients: any = this.ehcClients;
    const foundEhcClient = ehcClients.find((p: { ehcId: any }) => p.ehcId === ehc.id);

    if (foundEhcClient !== undefined && foundEhcClient !== null) {
      return foundEhcClient.ehcType;
    } else {
      return '';
    }
  }

  goToPrimary() {
    const ehc = {} as Ehc;
    const ehcClient: EhcClient = {} as EhcClient;
    ehcClient.ehcType = 'Primary';
    ehc.clientId = this.insuranceClient.clientId;
    ehc.ehcClient = ehcClient;
    ehc.status = 'Active';
    this.ehcEventType = InsuranceEventType.EHC_ADD_PRIMARY;
    this.selectedEhc = ehc;
  }
  goToSecondary() {
    const ehcClient: any = {} as EhcClient;
    ehcClient.clientId = this.client.id;
    this.selectedSecondary = ehcClient;
    this.selectedSecondary.clientId = this.client.id;
    this.ehcEventType = InsuranceEventType.EHC_SECONDARY;
  }

  deleteRow(ehc?: Ehc) {
    this.ehcEventType = InsuranceEventType.EHC_DELETE;
    if (ehc) {
      this.selectedEhc = ehc;
    }
  }

  cancelDelete() {
    this.ehcEventType = InsuranceEventType.EHC;
  }

  confirmDelete() {
    this.ehcEventType = InsuranceEventType.EHC;
    this.loadInsuranceClient();
  }

  loadInsuranceClient() {
    const client: any = this.client;
    this.insuranceService.findActiveByClientId(client.id).subscribe((res: HttpResponse<InsuranceClient>) => {
      const insuranceClient: any = res.body || new InsuranceClient();
      this.insuranceClient = insuranceClient;
      this.summaryLeftComponent.load(insuranceClient);
    });
  }
  goToEhcList() {
    this.ehcEventType = InsuranceEventType.EHC;
  }

  backToInsuranceTab() {
    this.ehcEventType = InsuranceEventType.EHC;
  }

  goToAddress() {
    this.ehcEventType = InsuranceEventType.EHC_ADDRESS;
  }
  goToCoverage() {
    this.ehcEventType = InsuranceEventType.EHC_COVERAGE;
  }

  afterUpdateCoverage() {
    this.loadInsuranceClient();
  }
  // this is call from secondartEdit and ehc-list
  ngOnEditSeconday(ehcClient: EhcClient) {
    this.selectedSecondary = ehcClient;
    this.ehcEventType = InsuranceEventType.EHC_SECONDARY_EDIT;
  }

  buildEhcPrimary(ehc: Ehc) {
    const ehcPrimary = {} as EhcPrimary;
    ehcPrimary.policyHolder = ehc.policyHolder;
    ehcPrimary.clientId = ehc.clientId;
    ehcPrimary.endDate = ehc.endDate;
    ehcPrimary.lastModifiedDate = ehc.lastModifiedDate;
    ehcPrimary.ehcType = 'Primary';
    ehcPrimary.ehcId = ehc.id;
    ehcPrimary.status = ehc.status;
    ehcPrimary.name = ehc.name;
    ehcPrimary.note = ehc.note;
    ehcPrimary.groupNumber = ehc.groupNumber;
    ehcPrimary.policyNumber = ehc.policyNumber;
    ehcPrimary.certificateNumber = ehc.certificateNumber;
    ehcPrimary.phone = ehc.phone;
    ehcPrimary.fax = ehc.fax;
    ehcPrimary.email = ehc.email;

    return ehcPrimary;
  }

  isAddPrimarySecondayPage() {
    const page = this.ehcEventType === 0 || this.ehcEventType === 2 || this.ehcEventType === 5;
    return page;
  }
  isSecondaryEditPage() {
    const page = !this.isAddPrimarySecondayPage() && this.ehcEventType !== 11;

    return page;
  }
}
