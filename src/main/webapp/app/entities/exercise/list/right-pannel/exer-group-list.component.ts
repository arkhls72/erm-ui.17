import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data, RouterModule } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import SharedModule from 'app/shared/shared.module';
import { SortDirective, SortByDirective } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ItemCountComponent } from 'app/shared/pagination';
import { FormsModule } from '@angular/forms';
import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { ExerGroupService } from '../../../exer-group/service/exer-group.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgFor, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-exer-group-list',
  templateUrl: './exer-group-list.component.html',
  imports: [
    FaIconComponent,
    RouterModule,
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
export class ExerGroupListComponent implements OnInit {
  @Output()
  deleteExerGroupEmitter = new EventEmitter<ExerGroup>();

  exerGroups?: ExerGroup[] = [];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  currentSearch!: string;

  constructor(
    protected exerGroupService: ExerGroupService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    public ngIf: NgIf,
    public ngFor: NgFor<any>,
  ) {}

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page || 1;
    if (!this.currentSearch) {
      this.exerGroupService
        .query({
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe(
          (res: HttpResponse<ExerGroup[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
          () => this.onError(),
        );
    } else {
      this.exerGroupService
        .search({
          query: this.currentSearch,
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe(
          (res: HttpResponse<ExerGroup[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
          () => this.onError(),
        );
    }
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  protected handleNavigation(): void {
    combineLatest(this.activatedRoute.data, this.activatedRoute.queryParamMap, (data: Data, params: ParamMap) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber);
      }
    }).subscribe();
  }
  trackId(index: number, item: ExerGroup): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  delete(exerGroup: ExerGroup): void {
    this.deleteExerGroupEmitter.emit(exerGroup);
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: ExerGroup[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.exerGroups = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
  search(query: string) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadPage(this.page);
  }
  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.loadPage(1);
  }

  getDateFormatForHtml(input: ExerGroup) {
    if (input && input.lastModifiedDate !== null && input.lastModifiedDate !== undefined) {
      return input.lastModifiedDate;
    }
    return '';
  }
}
