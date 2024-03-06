import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { PaginationParams } from 'app/entities/local-share/pagination-params';
import { Client } from 'app/entities/client/client.model';
import { HttpHeaders } from '@angular/common/http';
import { AssessmentService } from '../../../assessment/service/assessment.service';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import SharedModule from '../../../../shared/shared.module';
import { SortByDirective, SortDirective } from '../../../../shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../../shared/date';
import { ItemCountComponent } from '../../../../shared/pagination';
import { NgForOf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-assessment-list',
  templateUrl: './assessment-list.component.html',
  imports: [
    FormsModule,
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
    SortDirective,
    NgForOf,
  ],
})
export class AssessmentListComponent implements OnInit {
  @Input()
  client!: Client;

  @Output()
  selectAssessmentEventEmitter = new EventEmitter<Assessment>();

  @Output()
  deleteAssessmentEventEmitter = new EventEmitter<Assessment>();

  assessments!: Assessment[];
  eventSubscriber?: Subscription;
  ifSelected!: boolean;
  paginationParams!: PaginationParams;
  links: any;
  page!: number;
  totalItems: any;
  queryCount: any;
  ascending!: boolean;
  itemsPerPage: any;
  destinationPage: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  currentSearch!: string;
  constructor(
    protected assessmentService: AssessmentService,
    protected modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.initPaginationParams();
  }

  laodPagefromParent() {
    this.loadPage();
  }
  trackId(index: number, item: Assessment): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  delete(assessment: Assessment): void {
    this.deleteAssessmentEventEmitter.emit(assessment);
  }

  sort() {
    const result = [this.paginationParams.predicate + ',' + (this.paginationParams.reverse ? 'asc' : 'desc')];
    return result;
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
    this.loadPage(1);
    return params;
  }

  private onSuccess(data: Assessment[] | null, headers: HttpHeaders, page: number) {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.queryCount = this.totalItems;
    if (data) {
      this.assessments = data;
    }
    if (this.assessments) {
      const assessment = this.assessments[0];
      this.selectAssessmentEventEmitter.emit(assessment);
    }
  }
  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page || 1;

    if (this.currentSearch) {
      this.assessmentService
        .searchByClientId(
          {
            query: this.currentSearch,
            size: this.itemsPerPage,
            page: pageToLoad - 1,
          },
          this.client.id,
        )
        .subscribe(res => this.onSuccess(res.body, res.headers, pageToLoad));
      return;
    } else {
      this.assessmentService
        .findByClientPaginated(
          {
            page: this.page - 1,
            size: this.itemsPerPage,
          },
          this.client.id,
        )
        .subscribe(res => this.onSuccess(res.body, res.headers, pageToLoad));
    }
  }
  search(query: string) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadPage();
  }

  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.loadPage();
  }

  ngOnSelect(assessment?: Assessment) {
    this.selectAssessmentEventEmitter.emit(assessment);
  }

  deleteAssessment(assessment: Assessment) {
    this.deleteAssessmentEventEmitter.emit(assessment);
  }
}
