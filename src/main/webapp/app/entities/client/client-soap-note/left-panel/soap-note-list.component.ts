import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Client } from 'app/entities/client/client.model';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { PaginationParams } from 'app/entities/local-share/pagination-params';
import { TreatmentEventService } from 'app/entities/local-share/treatment-event.service';
import { SoapNote } from 'app/entities/soap-note/soap-note.model';
import { ItemCountComponent } from '../../../../shared/pagination';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../../shared/date';
import { SortByDirective, SortDirective } from '../../../../shared/sort';
import SharedModule from '../../../../shared/shared.module';
import { SoapNoteService } from '../../../soap-note/service/soap-note.service';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'bc-soap-note-list',
  templateUrl: './soap-note-list.component.html',
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
export class SoapNoteListComponent implements OnInit {
  paginationParams: PaginationParams;
  currentAccount: any;

  @Output()
  selectedSoapNoteEmitter = new EventEmitter<SoapNote>();

  @Input()
  client!: Client;

  soapNotes!: SoapNote[] | null;
  soapNote!: SoapNote | null;
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

  @Output()
  deleteSoapNoteEmitter = new EventEmitter<SoapNote>();

  // assessments!: Assessment[];
  constructor(
    private soapNoteService: SoapNoteService,
    public treatmentEventService: TreatmentEventService,
  ) {
    this.paginationParams = this.initPaginationParams();
  }

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.soapNoteService
      .findQueryByClientId(
        {
          query: this.currentSearch && this.currentSearch !== '' ? this.currentSearch : '',
          size: this.paginationParams.itemsPerPage,
          id: this.client.id,
          sort: this.sort(),
        },
        this.client.id,
      )
      .subscribe(res => this.onSuccess(res.body, res.headers));
    return;
  }

  loadDefault() {
    this.currentSearch = '';
    this.loadAll();
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

  trackId(index: number, item: SoapNote) {
    return item.id;
  }
  sort() {
    const result = [this.paginationParams.predicate + ',' + (this.paginationParams.reverse ? 'asc' : 'desc')];
    return result;
  }
  private onSuccess(data: SoapNote[] | null, headers: any) {
    this.totalItems = headers.get('X-Total-Count');
    this.queryCount = this.totalItems;
    this.soapNotes = data;
    if (this.soapNotes && this.soapNotes.length) {
      this.soapNote = this.soapNotes[0];
      this.selectedSoapNoteEmitter.emit(this.soapNote);
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

  reorder() {
    this.loadAll();
  }

  // reload() {
  //   this.soapNoteService
  //     .findQueryByClientId(
  //       {
  //         query:'',
  //         page: this.page - 1,
  //         size: this.itemsPerPage,
  //         sort: this.sort(),
  //       },
  //       this.client.id
  //     )
  //     .subscribe(res => this.onSuccess(res.body, res.headers));
  // }

  addNewTreatment() {
    this.loadAll();
  }

  ngOnClickSoapNote(soapNote: SoapNote) {
    this.soapNote = soapNote;
    this.selectedSoapNoteEmitter.emit(this.soapNote);
  }

  ngBackClinical() {
    this.loadAll();
  }

  deleteSoapNote(soapNote: SoapNote) {
    this.soapNote = soapNote;
    this.deleteSoapNoteEmitter.emit(soapNote);
  }

  initFromParentAfterAdd(soapNote: SoapNote) {
    if (!this.soapNotes) {
      this.soapNotes = [];
    }
    this.soapNotes.unshift(soapNote);
  }
  initFromParentAfterDelete(soapNote: SoapNote) {
    if (this.soapNotes) {
      const filtered = this.soapNotes.filter(item => item.id !== soapNote.id);
      if (filtered) {
        this.soapNotes = filtered;
        const x: SoapNote = this.soapNotes[0];
        this.ngOnClickSoapNote(x);
      }
    }
  }
}
