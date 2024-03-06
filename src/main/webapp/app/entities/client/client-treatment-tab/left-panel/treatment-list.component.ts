import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Client } from 'app/entities/client/client.model';
import { Plan } from 'app/entities/plan/plan.model';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { PaginationParams } from 'app/entities/local-share/pagination-params';
import { TreatmentEventType } from 'app/entities/local-share/treatmentEvent';
import { TreatmentEventService } from 'app/entities/local-share/treatment-event.service';
import { PlanNote } from 'app/entities/plan-note/plan-note.model';
import { PlanService } from '../../../plan/service/plan.service';
import { AssessmentService } from '../../../assessment/service/assessment.service';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { ItemCountComponent } from '../../../../shared/pagination';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../../shared/date';
import { SortByDirective, SortDirective } from '../../../../shared/sort';
import SharedModule from '../../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  selector: 'bc-treatment-list',
  templateUrl: './treatment-list.component.html',
  imports: [
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
    NgbPagination,
  ],
})
export class TreatmentListComponent implements OnInit {
  paginationParams: PaginationParams;
  currentAccount: any;
  @Input()
  client!: Client;
  plans!: Plan[];
  plan!: Plan;
  assessment!: Assessment;
  error: any;
  success: any;
  currentSearch!: string;
  routeData: any;
  links: any;
  totalItems = 0;
  queryCount: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  treatmentEventType: TreatmentEventType = TreatmentEventType.TREATMENT_LIST;

  @Output()
  selectedPlanEmitter = new EventEmitter<Plan>();

  @Output()
  selectedAssessmentEmitter = new EventEmitter<Assessment>();

  @Output()
  deletePlanEmitter = new EventEmitter<Plan>();

  assessments!: Assessment[];
  constructor(
    private planService: PlanService,
    private assessmentService: AssessmentService,
    public treatmentEventService: TreatmentEventService,
  ) {
    this.paginationParams = this.initPaginationParams();
  }

  ngOnInit() {
    this.initSummaryShortAssessment();
  }
  loadAll() {
    if (this.currentSearch) {
      this.planService
        .search({
          query: this.currentSearch,
          size: this.paginationParams.itemsPerPage,
          id: this.client.id,
          sort: this.sort(),
        })
        .subscribe(res => this.onSuccess(res.body, res.headers));
      return;
    } else {
      this.loadDefault();
    }
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.loadAll();
    }
  }

  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.loadAll();
  }
  search(query: string) {
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.loadAll();
  }

  trackId(index: number, item: Plan) {
    return item.id;
  }
  sort() {
    const result = [this.paginationParams.predicate + ',' + (this.paginationParams.reverse ? 'asc' : 'desc')];
    return result;
  }
  private onSuccess(data: Plan[] | null, headers: any) {
    // this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = headers.get('X-Total-Count');
    this.queryCount = this.totalItems;
    if (data) {
      this.plans = data;
      this.plan = this.plans[0];
    }
    if (!this.assessments) {
      this.initSummaryShortAssessment();
    }
    if (this.assessments && this.plan) {
      // we have the entire list of this clinet assessment
      const foundAssessment = this.assessments.find(item => item.id === this.plan.assessmentId);
      this.plan.assessment = foundAssessment;
      this.selectedPlanEmitter.emit(this.plan);
    }
  }
  private initPaginationParams(): PaginationParams {
    const params = new PaginationParams();
    this.page = 1;
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.previousPage = 1;
    params.itemsPerPage = this.itemsPerPage;

    params.maxSize = 5;
    params.currentPage = 1;
    params.destinationPage = 1;
    // reverse = false means DESC , the latest first
    params.reverse = false;
    params.predicate = 'lastModifiedDate';

    return params;
  }

  loadFromParent() {
    this.initPaginationParams();
    this.loadAll();
  }
  reorder() {
    this.loadAll();
  }

  loadDefault() {
    const client: any = this.client;
    this.planService
      .findByClientId(
        {
          page: this.page - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        },
        client.id,
      )
      .subscribe(res => this.onSuccess(res.body, res.headers));
  }

  initSummaryShortAssessment() {
    const client: any = this.client;
    const id: number = client.id;
    this.assessmentService.findShortListSummaryByClient(id).subscribe(res => {
      const assessments: any = res.body;
      this.assessments = assessments;
      this.loadAll();
    });
  }

  getAssessment(id: any) {
    if (id && this.assessments) {
      const foundAssessment = this.assessments.find(item => item.id === id);
      if (foundAssessment) {
        return foundAssessment.name;
      }
    }

    return '';
  }
  addNewTreatment() {
    this.treatmentEventType = TreatmentEventType.TREATMENT_SELECT_ASSESSMENT;
    this.plan = {} as Plan;
    this.plan.clientId = this.client.id;
    this.loadAll();
  }

  ngOnSelectTreatmentPlan(plan: Plan) {
    this.plan = plan;
    const foundAssessment = this.assessments.find(item => item.id === plan.assessmentId);
    if (foundAssessment) {
      this.assessment = foundAssessment;
      this.selectedAssessmentEmitter.emit(this.assessment);
    }
    if (this.plan.clinicalNote) {
      this.plan.clinicalNote = {} as PlanNote;
      this.plan.clinicalNote.note = '';
    }
    this.selectedPlanEmitter.emit(this.plan);
  }

  ogOnDeleteClinical(plan: Plan) {
    this.plan = plan;
    this.treatmentEventType = TreatmentEventType.TREATMENT_DELETE;
    this.loadAll();
  }

  ngBackClinical() {
    this.treatmentEventType = TreatmentEventType.TREATMENT_LIST;
    this.loadAll();
  }

  deletePlan(plan: Plan) {
    this.plan = plan;
    this.deletePlanEmitter.emit(plan);
  }

  getAssessmentName(plan: Plan) {
    const assessment = this.assessments.find(a => a.id === plan.assessmentId);
    if (assessment) {
      return assessment.name;
    }

    return '';
  }
}
