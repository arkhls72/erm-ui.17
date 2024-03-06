import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CoverageTherapy } from 'app/entities/coverage/coverage-therapy.model';
import { Coverage } from 'app/entities/coverage/coverage.model';
import { Therapy } from 'app/entities/therapy/therapy.model';
import { ClaimEventService } from 'app/entities/local-share/claim-event.service';
import { Wsib } from 'app/entities/wsib/wsib.model';
import { ClaimEvent } from 'app/entities/local-share/claim-event';
import { HttpResponse } from '@angular/common/http';
import { CoverageService } from '../../../coverage/service/coverage.service';
import { TherapyService } from '../../../therapy/service/therapy.service';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
const thisEventSource = 'wsib-coverage';
@Component({
  standalone: true,
  selector: 'bc-wsib-coverage',
  templateUrl: './wsib-coverage.component.html',
  imports: [FormsModule, NgForOf],
})
export class WsibCoverageComponent implements OnInit {
  @Input()
  wsib!: Wsib;
  editMode = false;
  coverageTherapies!: CoverageTherapy[];

  coverages!: Coverage[];
  toSaveCoverage!: Coverage[];
  therapies!: Therapy[];

  currentAccount: any;
  error: any;
  success: any;

  selectedIndex!: number;
  eventSubscriber!: Subscription;
  claimEventSubscription!: Subscription;

  constructor(
    private coverageService: CoverageService,
    private therapyService: TherapyService,
    private eventService: ClaimEventService,
  ) {}
  loadAll() {
    this.initCoverageForDisplay();
  }

  ngOnInit() {
    this.claimEventSubscription = this.eventService.subscribe(this.onClaimEvent.bind(this));
    this.loadAll();
  }

  save() {
    const selectedWsib: any = this.wsib;
    this.initCoverageForSave();
    this.editMode = this.toSaveCoverage && this.toSaveCoverage.length > 0;
    if (this.toSaveCoverage && this.toSaveCoverage.length > 0) {
      this.subscribeToSaveResponse(this.coverageService.createOrUpdateWsib(this.toSaveCoverage, selectedWsib.id));
    }
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<Coverage[]>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(): void {
    this.initCoverageForDisplay();
  }

  protected onSaveError(): void {
    this.editMode = false;
  }

  private onError() {
    this.editMode = false;
    const selectedIndex: any = null;
    this.selectedIndex = selectedIndex;
  }

  private onClaimEvent(evt: ClaimEvent): void {
    if (evt.source && evt.source === thisEventSource) {
      return;
    }
  }

  public getTherapyName(therapyId: number) {
    const therapy = this.therapies.find(p => p.id === therapyId);
    if (therapy !== null && therapy !== undefined) {
      return therapy.name;
    }
    return '';
  }
  public initCoverage() {
    const array = [];
    const therapies: any = this.therapies;

    if (this.therapies) {
      for (let i = 0; i < this.therapies.length; i++) {
        const copy: CoverageTherapy = new CoverageTherapy();
        copy.therapyId = this.therapies[i].id;
        copy.therapyName = this.therapies[i].name;
        copy.wsibId = this.wsib.id;
        const coverage = this.getCoverageIdByTherapy(therapies[i].id);
        if (coverage !== null && coverage !== undefined) {
          copy.coverageId = coverage.id;
          copy.note = coverage.note;
          copy.limit = coverage.limit;
        }
        array.push(copy);
      }
      this.coverageTherapies = array;
    }
  }
  private getCoverageIdByTherapy(therapyId: number) {
    return this.coverages.find(p => p.therapyId === therapyId);
  }

  private initCoverageForSave() {
    const array = [];
    if (this.therapies !== undefined && this.therapies !== null) {
      for (let i = 0; i < this.coverageTherapies.length; i++) {
        const copy: Coverage = {} as Coverage;
        if (this.coverageTherapies[i].coverageId === undefined && this.coverageTherapies[i].limit === undefined) {
          continue;
        }
        const coverage: Coverage = <Coverage>this.coverageTherapies[i];
        copy.id = coverage.id;
        copy.limit = coverage.limit;
        copy.therapyId = coverage.therapyId;
        copy.wsibId = coverage.wsibId;
        array.push(copy);
      }
      this.toSaveCoverage = array;
    }
  }

  private initCoverageForDisplay() {
    this.therapyService.queryAll().subscribe(res => {
      const copy1: any = res.body;
      this.therapies = copy1;
      if (this.wsib && this.wsib.id) {
        this.coverageService.queryByWsib(this.wsib.id).subscribe(rs => {
          const copy2: any = rs.body;
          this.coverages = copy2;
          this.initCoverage();
        });
      }
    });
  }
  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.editMode = true;

      return true;
    } else {
      this.editMode = false;
    }
    this.editMode = false;
    return false;
  }
}
