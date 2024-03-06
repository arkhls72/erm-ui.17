import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Coverage } from 'app/entities/coverage/coverage.model';
import { Therapy } from 'app/entities/therapy/therapy.model';

import { HttpResponse } from '@angular/common/http';
import { Mva } from 'app/entities/mva/mva.model';
import { CoverageTherapy } from '../../../coverage/coverage-therapy.model';
import { CoverageService } from '../../../coverage/service/coverage.service';
import { TherapyService } from '../../../therapy/service/therapy.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
@Component({
  standalone: true,
  selector: 'bc-mva-coverage',
  templateUrl: './mva-coverage.component.html',
  imports: [FormsModule, NgForOf, NgIf],
})
export class MvaCoverageComponent implements OnInit {
  @Input()
  mva!: Mva;
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
  ) {}
  loadAll() {
    this.initCoverageForDisplay();
  }

  ngOnInit() {
    this.loadAll();
  }

  save() {
    const selectedMva: any = this.mva;
    this.initCoverageForSave();
    this.editMode = this.toSaveCoverage && this.toSaveCoverage.length > 0;
    if (this.toSaveCoverage && this.toSaveCoverage.length > 0) {
      this.subscribeToSaveResponse(this.coverageService.createOrUpdateMva(this.toSaveCoverage, selectedMva.id));
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
        copy.mvaId = this.mva.id;
        const coverage = <Coverage>this.getCoverageIdByTherapy(therapies[i].id);
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
  private getCoverageIdByTherapy(therapyId: number): Coverage | undefined {
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
        const coverCopy = this.coverageTherapies[i];

        if (coverCopy) {
          copy.id = coverCopy.id!;
          copy.limit = this.coverageTherapies[i].limit;
          copy.therapyId = this.coverageTherapies[i].therapyId;
          copy.mvaId = this.coverageTherapies[i].mvaId;
        }

        array.push(copy);
      }
      this.toSaveCoverage = array;
    }
  }

  private initCoverageForDisplay() {
    this.therapyService.queryAll().subscribe(res => {
      const copy1: any = res.body;
      this.therapies = copy1;
      if (this.mva && this.mva.id) {
        this.coverageService.queryByMva(this.mva.id).subscribe(rs => {
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
