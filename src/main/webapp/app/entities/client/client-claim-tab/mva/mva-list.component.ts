import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Mva } from 'app/entities/mva/mva.model';
import { Client } from 'app/entities/client/client.model';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { MvaService } from '../../../mva/service/mva.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { ItemCountComponent } from '../../../../shared/pagination';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../../shared/date';
import { SortByDirective, SortDirective } from '../../../../shared/sort';
import SharedModule from '../../../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'bc-mva-list',
  templateUrl: './mva-list.component.html',
  imports: [
    FaIconComponent,
    NgForOf,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
    NgIf,
  ],
})
export class MvaListComponent implements OnInit {
  @Input()
  client!: Client;

  @Output()
  editMvaEmitter = new EventEmitter();
  @Output()
  deleteMvaEmitter = new EventEmitter();

  mvas?: Mva[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected mvaService: MvaService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
  ) {}

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page || 1;

    this.mvaService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<Mva[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
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

  trackId(index: number, item: Mva): number {
    return item.id!;
  }

  delete(mva: Mva): void {
    this.deleteMvaEmitter.emit(mva);
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: Mva[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.mvas = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  editMva(mva: Mva) {
    this.editMvaEmitter.emit(mva);
  }
}
