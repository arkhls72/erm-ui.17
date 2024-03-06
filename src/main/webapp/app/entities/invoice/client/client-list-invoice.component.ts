import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data, RouterLink } from '@angular/router';
import { Subscription, combineLatest, Observable, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Client } from 'app/entities/client/client.model';
import { Invoice } from 'app/entities/invoice/invoice.model';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { ClientService } from '../../client/service/client.service';
import { InvoiceService } from '../service/invoice.service';
import { ClientDeleteDialogComponent } from '../../client/delete/client-delete-dialog.component';
import { NgForOf, NgIf } from '@angular/common';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ItemCountComponent } from '../../../shared/pagination';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../shared/date';
import { SortByDirective, SortDirective } from '../../../shared/sort';
import SharedModule from '../../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'bc-client-list-invoice',
  templateUrl: './client-list-invoice.component.html',
  imports: [
    NgIf,
    AlertErrorComponent,
    AlertComponent,
    FaIconComponent,
    RouterLink,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
    NgForOf,
  ],
})
export class ClientListInvoiceComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  invoice?: Invoice;
  clients?: Client[];
  client!: Client;
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected clientService: ClientService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected invoiceService: InvoiceService,
    protected modalService: NgbModal,
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;

    this.clientService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<Client[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
        () => this.onError(),
      );
  }

  ngOnInit(): void {
    this.handleNavigation();
    this.registerChangeInClients();
  }

  protected handleNavigation(): void {
    combineLatest(this.activatedRoute.data, this.activatedRoute.queryParamMap, (data: Data, params: ParamMap) => {
      const defaultSort: string[] = [];
      defaultSort.push('id');
      defaultSort.push('asc');

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
        this.loadPage(pageNumber, true);
      }
    }).subscribe();
  }

  ngOnDestroy(): void {}

  trackId(index: number, item: Client): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInClients(): void {
    this.loadPage();
  }

  delete(client: Client): void {
    const modalRef = this.modalService.open(ClientDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.client = client;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: Client[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/client'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.clients = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  onSave(id?: number) {
    // this.router.navigate(['/client/' + result.id + '/view']);
    const invoice = {} as Invoice;
    invoice.clientId = id;
    invoice.status = 'Draft';
    invoice.taxTotal = 0.0;
    invoice.subTotal = 0.0;
    invoice.clinicId = 1;
    this.subscribeToSaveResponse(this.invoiceService.create(invoice));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Invoice>>): void {
    result.subscribe(res => this.onSaveSuccess(res));
  }
  protected onSaveSuccess(res: HttpResponse<Invoice>) {
    this.invoice = res.body!;
    this.router.navigate(['/invoice/' + this.invoice.id + '/view']);
  }
}
