import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { PaginationParams } from 'app/entities/local-share/pagination-params';
import { Plan } from 'app/entities/plan/plan.model';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { TreatmentEvent, TreatmentEventType } from 'app/entities/local-share/treatmentEvent';
import { TreatmentEventService } from 'app/entities/local-share/treatment-event.service';
import { Client } from 'app/entities/client/client.model';
import { PlanService } from '../../../plan/service/plan.service';
import { AssessmentService } from '../../../assessment/service/assessment.service';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { ItemCountComponent } from '../../../../shared/pagination';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../../shared/date';
import { SortByDirective, SortDirective } from '../../../../shared/sort';
import SharedModule from '../../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
const thisEventSource = 'clinical-add';
@Component({
  standalone: true,
  selector: 'bc-treatment-select-assessment',
  templateUrl: './treatment-select-assessment.component.html',
  imports: [
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
    FormsModule,
  ],
})
export class TreatmentSelectAssessmentComponent implements OnInit {
  paginationParams: PaginationParams;

  @Input()
  client!: Client;

  @Input()
  plan!: Plan;

  selecetedAssessment!: Assessment;

  @Output()
  cancelAddTreatmentEmitter = new EventEmitter();

  @Output()
  isSelectedAssessEmitter = new EventEmitter<Assessment>();

  @Output()
  saveTreatmentEmitter = new EventEmitter<Assessment>();
  links: any;
  totalItems: any;
  queryCount: any;
  itemsPerPage: any;
  destinationPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  currentSearch!: string;
  currentAccount: any;
  startDateDp: any;
  endDateDp: any;
  assessments!: Assessment[];
  // isEmptyAssessment = true;
  eventSubscriber!: Subscription;
  treatmentEventType: TreatmentEventType = TreatmentEventType.TREATMENT_SELECT_ASSESSMENT;

  constructor(
    public eventService: TreatmentEventService,
    private planService: PlanService,
    private assessmentService: AssessmentService,
  ) {
    this.paginationParams = this.initPaginationParams();
  }

  ngOnInit() {
    this.loadIt();
  }

  loadIt() {
    this.reloadAssessmentList();
  }

  private onAssessmentEvent(evt: TreatmentEvent): void {
    if (evt.source && evt.source === thisEventSource) {
      return;
    }
  }

  private reloadAssessmentList() {
    this.assessmentService
      .findSummaryByClient(
        {
          page: this.destinationPage - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        },
        this.client.id,
      )
      .subscribe(res => this.onSuccess(res.body, res.headers));
  }

  loadPage(page: number) {
    this.destinationPage = page;
    this.treatmentEventType = TreatmentEventType.TREATMENT_SELECT_ASSESSMENT;
    this.assessmentService
      .findSummaryByClient(
        {
          page: this.destinationPage - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        },
        this.client.id,
      )
      .subscribe(res => this.onSuccess(res.body, res.headers));
  }
  private onSuccess(data: any, headers: any) {
    this.totalItems = headers.get('X-Total-Count');
    this.queryCount = this.totalItems;
    this.assessments = data;
    this.treatmentEventType = TreatmentEventType.TREATMENT_SELECT_ASSESSMENT;
    this.resetRadioButtons();
  }

  private initPaginationParams(): PaginationParams {
    const params = new PaginationParams();
    this.page = 1;
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.previousPage = 1;
    this.destinationPage = 1;
    params.maxSize = ITEMS_PER_PAGE;
    params.currentPage = 1;
    params.destinationPage = 1;
    params.reverse = false;
    params.predicate = 'lastModifiedDate';

    return params;
  }

  sort() {
    const result = [this.paginationParams.predicate + ',' + (this.paginationParams.reverse ? 'asc' : 'desc')];
    return result;
  }

  reorder() {
    this.reloadAssessmentList();
  }

  isSelected(assessment: Assessment): boolean {
    if (this.selecetedAssessment && this.selecetedAssessment.id === assessment.id) {
      return true;
    } else {
      return false;
    }
  }

  addOrRemoveAssessment(assessment: Assessment, event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.checked) {
      const foundElement: any = this.assessments.find(item => item.id === assessment.id);
      // this.isEmptyAssessment = false;
      this.selecetedAssessment = foundElement;
      if (!this.plan) {
        this.plan = {} as Plan;
      }
      this.plan.assessmentId = this.selecetedAssessment.id;
      this.isSelectedAssessEmitter.emit(assessment);
    }
  }
  trackId(index: number, item: Assessment): number {
    return item.id!;
  }

  backToTreatmentTab() {
    this.cancelAddTreatmentEmitter.emit();
  }

  goToSaveAssessment() {
    this.saveTreatmentEmitter.emit(this.selecetedAssessment);
  }
  // Unchecked the radio button once the list has been loaded.
  resetRadioButtons() {
    const radio: any = document.getElementsByName('radioAssessment');
    if (radio && radio.length > 0) {
      for (let i = 0; i < radio.length; i++) {
        radio[i].checked = false;
      }
    }
  }
}
