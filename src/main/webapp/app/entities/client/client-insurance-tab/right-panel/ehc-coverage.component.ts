import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CoverageTherapy } from 'app/entities/coverage/coverage-therapy.model';
import { Ehc } from 'app/entities/ehc/ehc.model';
import { Coverage } from 'app/entities/coverage/coverage.model';
import { Therapy } from 'app/entities/therapy/therapy.model';
import { HttpResponse } from '@angular/common/http';
import { CoverageService } from '../../../coverage/service/coverage.service';
import { TherapyService } from '../../../therapy/service/therapy.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
@Component({
  standalone: true,
  selector: 'bc-ehc-coverage',
  templateUrl: './ehc-coverage.component.html',
  imports: [FormsModule, NgForOf, NgIf],
})
export class EhcCoverageComponent implements OnInit {
  editMode = false;
  @Input()
  ehc!: Ehc;

  @Output()
  upDateCoverageEmitter = new EventEmitter();
  coverageTherapies!: CoverageTherapy[];

  coverages!: Coverage[] | null | undefined;
  toSaveCoverage!: Coverage[];
  therapies!: Therapy[];

  currentAccount: any;
  error: any;
  success: any;
  routeData: any;
  selectedIndex!: number;
  eventSubscriber!: Subscription;
  insuranceEventSubscription!: Subscription;

  constructor(
    private coverageService: CoverageService,
    private therapyService: TherapyService,
  ) {}

  ngOnInit() {
    this.initCoverageForDisplay();
  }

  initCoverageForDisplay() {
    this.therapyService.queryAll().subscribe(res => {
      const copy1: any = res.body;
      this.therapies = copy1;
      if (this.ehc && this.ehc.id) {
        this.coverageService.queryByEhc(this.ehc.id).subscribe(rs => {
          const copy2: any = rs.body;
          this.coverages = copy2;
          this.initCoverage();
        });
      }
    });
  }

  save() {
    if (this.ehc && this.ehc.id) {
      this.initCoverageForSave();
      if (this.toSaveCoverage && this.toSaveCoverage.length > 0) {
        this.subscribeToSaveResponse(this.coverageService.createOrUpdateEhc(this.toSaveCoverage, this.ehc.id));
      }
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Coverage[]>>): void {
    result.subscribe(resp => this.onSaveSuccess(resp.body));
  }

  protected onSaveSuccess(resp?: Coverage[] | null): void {
    this.coverages = resp;
    this.initCoverage();
    this.upDateCoverageEmitter.emit();
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
    if (therapies !== undefined && therapies !== null) {
      for (let i = 0; i < therapies.length; i++) {
        const copy: CoverageTherapy = new CoverageTherapy();
        copy.therapyId = this.therapies[i].id;
        copy.therapyName = this.therapies[i].name;
        copy.ehcId = this.ehc.id;
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
    return this.coverages!.find(p => p.therapyId === therapyId);
  }

  private initCoverageForSave() {
    const array = [];
    if (this.therapies !== undefined && this.therapies !== null) {
      for (let i = 0; i < this.coverageTherapies.length; i++) {
        const copy: Coverage = {} as Coverage;
        if (this.coverageTherapies[i].coverageId === undefined && this.coverageTherapies[i].limit === undefined) {
          continue;
        }
        const coverage = this.coverageTherapies[i];
        if (coverage && coverage.coverageId) {
          copy.id = coverage.coverageId;
          copy.limit = coverage.limit;
          copy.therapyId = coverage.therapyId;
          copy.ehcId = coverage.ehcId;
          copy.note = coverage.note;
        }

        array.push(copy);
      }
      this.toSaveCoverage = array;
    }
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
