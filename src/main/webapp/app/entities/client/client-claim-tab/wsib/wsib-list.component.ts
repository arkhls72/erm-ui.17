import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';

import { Wsib } from 'app/entities/wsib/wsib.model';
import { Client } from 'app/entities/client/client.model';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { WsibService } from '../../../wsib/service/wsib.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import SharedModule from '../../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SortByDirective, SortDirective } from '../../../../shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../../shared/date';
import { ItemCountComponent } from '../../../../shared/pagination';

@Component({
  standalone: true,
  selector: 'bc-wsib-list',
  templateUrl: './wsib-list.component.html',
  imports: [
    FaIconComponent,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
  ],
})
export class WsibListComponent implements OnInit {
  @Input()
  client?: Client;
  wsibs?: Wsib[];
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  @Output()
  wsibEditEmitter = new EventEmitter<Wsib>();

  @Output()
  wsibDeleteEmitter = new EventEmitter<Wsib>();

  constructor(
    protected wsibService: WsibService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
  ) {}

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page || 1;

    this.wsibService
      .queryByClientId(
        {
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        },
        this.client!.id,
      )
      .subscribe(
        (res: HttpResponse<Wsib[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
        () => this.onError(),
      );
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  protected handleNavigation(): void {
    combineLatest(this.activatedRoute.data, this.activatedRoute.queryParamMap, (data: Data, params: ParamMap) => {
      const defaultSort: string[] = [];
      defaultSort.push('id');
      defaultSort.push('desc');

      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort =
        params.get('sort') !== null && params.get('sort') !== undefined
          ? (params.get('sort') ?? data['defaultSort']).split(',')
          : defaultSort;
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber);
      }
    }).subscribe();
  }

  trackId(index: number, item: Wsib): number {
    return item.id!;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: Wsib[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.wsibs = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
  editWsib(wsib: Wsib) {
    this.wsibEditEmitter.emit(wsib);
  }

  deleteRow(wsib: Wsib) {
    this.wsibDeleteEmitter.emit(wsib);
  }
}
