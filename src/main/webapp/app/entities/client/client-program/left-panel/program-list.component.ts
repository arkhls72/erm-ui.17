import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationParams } from 'app/entities/local-share/pagination-params';

import { Client } from 'app/entities/client/client.model';
import { HttpHeaders } from '@angular/common/http';
import { Prog } from 'app/entities/prog/prog.model';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { ProgService } from '../../../prog/service/prog.service';
import { AssessmentService } from '../../../assessment/service/assessment.service';
import { FormsModule } from '@angular/forms';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { CommonModule } from '@angular/common';
import { ItemCountComponent } from '../../../../shared/pagination';
import { RouterModule } from '@angular/router';
import SharedModule from '../../../../shared/shared.module';
import SortDirective from '../../../../shared/sort/sort.directive';
import { SortByDirective } from '../../../../shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../../shared/date';

@Component({
  standalone: true,
  selector: 'bc-program-list',
  templateUrl: './program-list.component.html',
  imports: [
    FormsModule,
    CommonModule,
    ItemCountComponent,
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    SortDirective,
  ],
})
export class ProgramListComponent implements OnInit {
  @Input()
  client!: Client;

  @Output()
  selectProgEventEmitter = new EventEmitter<Prog>();

  @Output()
  deleteProgEventEmitter = new EventEmitter<Prog>();

  programs!: Prog[];
  eventSubscriber?: Subscription;

  ifSelected!: boolean;
  paginationParams!: PaginationParams;
  links: any;
  page: any;
  totalItems: any;
  queryCount: any;
  ascending!: boolean;
  itemsPerPage: any;
  destinationPage: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  currentSearch!: string;
  assessments!: Assessment[];
  constructor(
    protected progService: ProgService,
    protected assessmentService: AssessmentService,
    protected modalService: NgbModal,
  ) {
    this.paginationParams = this.initPaginationParams();
  }

  ngOnInit(): void {
    this.loadPage();
    // get the list of assessments to display name of assessment name in programs loop
    if (this.client && this.client.id) {
      this.assessmentService.findByClient(this.client.id).subscribe(res => {
        if (res && res.body) {
          this.assessments = res.body;
        }
      });
    }
  }

  loadPagefromParent() {
    this.initPaginationParams();
    this.loadAll();
  }
  trackId(index: number, item: Prog): number {
    return item.id!;
  }

  delete(prog: Prog): void {
    this.deleteProgEventEmitter.emit(prog);
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
    params.itemsPerPage = this.itemsPerPage;

    params.maxSize = 5;
    params.currentPage = 1;
    params.destinationPage = 1;
    // reverse = false means DESC , the latest first
    params.reverse = false;
    params.predicate = 'lastModifiedDate';
    return params;
  }

  private onSuccess(data: Prog[] | null, headers: HttpHeaders) {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.queryCount = this.totalItems;
    if (data) {
      this.programs = data;
    }
    if (this.programs) {
      const assessment = this.programs[0];
      this.selectProgEventEmitter.emit(assessment);
    }
  }

  loadPage(page?: number): void {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.loadAll();
    }
  }

  loadAll(): void {
    if (this.currentSearch) {
      this.progService
        .searchByClient(
          {
            query: this.currentSearch,
            size: this.itemsPerPage,
            page: this.page - 1,
            sort: this.sort(),
          },
          this.client.id,
        )
        .subscribe(res => this.onSuccess(res.body, res.headers));
      return;
    } else {
      this.progService
        .findByClient(
          {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
          },
          this.client.id,
        )
        .subscribe(res => this.onSuccess(res.body, res.headers));
    }
  }
  search(query: string) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadAll();
  }

  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.loadAll();
  }

  ngOnSelect(prog?: Prog) {
    this.selectProgEventEmitter.emit(prog);
  }

  deleteProg(prog: Prog) {
    this.deleteProgEventEmitter.emit(prog);
  }
  getAssessment(prog: Prog) {
    if (this.assessments) {
      const found = this.assessments.find(item => item.id === prog.assessmentId);
      if (found) {
        return found.name;
      }
    }
    return '';
  }
}
