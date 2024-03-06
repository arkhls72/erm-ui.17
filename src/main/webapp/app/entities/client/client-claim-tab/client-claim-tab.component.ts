import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Client } from '../client.model';
import { ClaimEvent, ClaimEventType } from 'app/entities/local-share/claim-event';
import { Mva } from 'app/entities/mva/mva.model';
import { ClaimService } from 'app/entities/claim/claim.service';
import { ClaimEventService } from 'app/entities/local-share/claim-event.service';
import { Therapy } from 'app/entities/therapy/therapy.model';
import { Coverage } from 'app/entities/coverage/coverage.model';
import { Wsib } from 'app/entities/wsib/wsib.model';
import { Claim } from 'app/entities/claim/claim.model';
import { ActivatedRoute } from '@angular/router';
import { WsibService } from '../../wsib/service/wsib.service';
import { WsibListComponent } from './wsib/wsib-list.component';
import { WsibEditComponent } from './wsib/wsib-edit.component';
import { WsibAddComponent } from './wsib/wsib-add.component';
import { WsibCoverageComponent } from './wsib/wsib-coverage.component';
import { WsibAddressComponent } from './wsib/wsib-address.component';
import { WsibDeleteComponent } from './wsib/wsib-delete.component';
import { MvaListComponent } from './mva/mva-list.component';
import { MvaEditComponent } from './mva/mva-edit.component';
import { MvaAddComponent } from './mva/mva-add.component';
import { MvaCoverageComponent } from './mva/mva-coverage.component';
import { MvaAddressComponent } from './mva/mva-address.component';
import { MvaDeleteComponent } from './mva/mva-delete.component';
import { NgIf } from '@angular/common';

const thisEventSource = 'client-claim-tab';
@Component({
  standalone: true,
  selector: 'bc-client-claim-tab',
  templateUrl: './client-claim-tab.component.html',
  imports: [
    WsibListComponent,
    WsibEditComponent,
    WsibAddComponent,
    WsibCoverageComponent,
    WsibAddressComponent,
    WsibDeleteComponent,
    MvaListComponent,
    MvaEditComponent,
    MvaDeleteComponent,
    MvaAddComponent,
    MvaCoverageComponent,
    MvaAddressComponent,
    NgIf,
  ],
})
export class ClaimTabComponent implements OnInit {
  @Input()
  client!: Client;

  claim?: Claim;

  wsibs?: Wsib[];
  selectedWsib!: Wsib;
  selectedMva!: Mva;
  clientCoverages?: Coverage[];
  clientTherapies?: Therapy[];
  mvaTherapies?: Therapy[];
  wsibEventType?: ClaimEventType = ClaimEventType.CLAIM;
  mvaEventType?: ClaimEventType = ClaimEventType.CLAIM;

  eventSubscription!: Subscription;
  mvas!: Mva[];
  constructor(
    private route: ActivatedRoute,
    private wsibService: WsibService,
    private claimService: ClaimService,
    private claimEventService: ClaimEventService,
  ) {}
  ngOnInit() {
    const client: any = this.client;
    this.load(client.id);
  }

  load(id: number) {
    switch (this.wsibEventType) {
      case ClaimEventType.CLAIM: {
        this.claimService.findActiveByClientId(id).subscribe(res => {
          const claim: any = res.body;
          this.claim = claim;
          this.wsibs = claim.wsibs;
          this.mvas = claim.mvas;
          this.mvaTherapies = claim.mvaTherapies;
          this.clientCoverages = claim.coverages;
          this.clientTherapies = claim.therapies;
          this.initCoverages();
        });

        break;
      }
      default: {
        break;
      }
    }
  }
  loadWsibById() {
    const id = this.selectedWsib.id;
    if (id) {
      this.wsibService.find(id).subscribe(rs => {
        if (rs.body) {
          this.selectedWsib = rs.body;
          this.wsibEventType = ClaimEventType.WSIB_EDIT;
        }
      });
    }
  }

  goWsibBackPage() {
    if (this.client) {
      const clientId = this.client.id;
      switch (this.wsibEventType) {
        case ClaimEventType.WSIB_COVERAGE:
          this.wsibEventType = ClaimEventType.WSIB_EDIT;
          break;
        case ClaimEventType.WSIB_ADDRESS:
          this.wsibEventType = ClaimEventType.WSIB_EDIT;
          break;

        default:
          this.wsibEventType = ClaimEventType.CLAIM;
          if (clientId) {
            this.load(clientId);
          }
          break;
      }
    }
  }

  editWsib(wsib: Wsib) {
    this.selectedWsib = wsib;
    this.loadWsibById();
  }

  wsibCoverage() {
    this.wsibEventType = ClaimEventType.WSIB_COVERAGE;
  }

  wsibAddress() {
    this.wsibEventType = ClaimEventType.WSIB_ADDRESS;
  }
  ngOnMvaEdit() {
    const client: any = this.client;
    this.wsibEventType = ClaimEventType.MVA_EDIT;
    this.load(client.id);
  }

  public getTherapyName(coverage: Coverage) {
    const clientTherapies: any = this.clientTherapies;
    const therapy = clientTherapies.find((p: { id: number | undefined }) => p.id === coverage.therapyId);
    if (therapy !== null && therapy !== undefined) {
      return therapy.name;
    }
    return '';
  }

  public getMvaTherapyName(coverage: Coverage) {
    const mvaTherapies: any = this.mvaTherapies;
    const therapy = mvaTherapies.find((p: { id: number | undefined }) => p.id === coverage.therapyId);
    if (therapy !== null && therapy !== undefined) {
      return therapy.name;
    }
    return '';
  }
  public initCoverages() {
    const copy: any = this.wsibs;
    const wsibs: any = this.wsibs;
    const clientCoverages: any = this.clientCoverages;

    for (let i = 0; i < copy.length; i++) {
      const holder = [];
      for (let j = 0; j < clientCoverages.length; j++) {
        if (wsibs[i].id !== undefined && wsibs[i].id !== null && wsibs[i].id === clientCoverages[j].wsibId) {
          holder.push(clientCoverages[j]);
        }
      }
      if (holder.length > 0) {
        wsibs[i].coverages = holder;
      }
    }

    this.wsibs = wsibs;
    const mvaCopy = this.mvas;
    const mvas: any = this.mvas;
    for (let i = 0; i < mvaCopy.length; i++) {
      const holder = [];
      for (let j = 0; j < clientCoverages.length; j++) {
        if (this.mvas[i].id !== null && this.mvas[i].id !== undefined && this.mvas[i].id === clientCoverages[j].mvaId) {
          holder.push(clientCoverages[j]);
        }
      }
      if (holder.length > 0) {
        mvas[i].coverages = holder;
      }
    }
    this.mvas = mvas;
  }

  /** ****************************************************************************
   *    Event Handler
   ** ***************************************************************************/

  private onClaimEvent(evt: ClaimEvent): void {
    const claim: any = this.claim;
    if (evt.source && evt.source === thisEventSource) {
      this.wsibEventType = ClaimEventType.CLAIM;
      this.load(claim.clientId);
      return;
    }
  }

  addWsib() {
    this.wsibEventType = ClaimEventType.WSIB_ADD;
  }
  deleteWsib(wsib: Wsib) {
    this.selectedWsib = wsib;
    this.wsibEventType = ClaimEventType.WSIB_DELETE;
  }
  editMva(mva: Mva) {
    this.mvaEventType = ClaimEventType.MVA_EDIT;
    this.selectedMva = mva;
  }
  deleteMva(mva: Mva) {
    this.mvaEventType = ClaimEventType.MVA_DELETE;
    this.selectedMva = mva;
  }
  goMvaBackPage() {
    if (this.client) {
      const clientId = this.client.id;
      switch (this.mvaEventType) {
        case ClaimEventType.MVA_COVERAGE:
          this.mvaEventType = ClaimEventType.MVA_EDIT;
          break;
        case ClaimEventType.MVA_ADDRESS:
          this.mvaEventType = ClaimEventType.MVA_EDIT;
          break;

        default:
          this.mvaEventType = ClaimEventType.CLAIM;
          if (clientId) {
            this.load(clientId);
          }
          break;
      }
    }
  }
  mvaAddress() {
    this.mvaEventType = ClaimEventType.MVA_ADDRESS;
  }

  mvaCoverage() {
    this.mvaEventType = ClaimEventType.MVA_COVERAGE;
  }
  addMva() {
    this.mvaEventType = ClaimEventType.MVA_ADD;
  }
}
