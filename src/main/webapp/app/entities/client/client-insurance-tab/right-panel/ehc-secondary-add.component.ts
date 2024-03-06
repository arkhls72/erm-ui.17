import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { EhcClient } from 'app/entities/ehc-client/ehc-client.model';
import { EhcPrimary } from 'app/entities/ehc-primary/ehc-primary.model';
import { InsuranceEventType } from 'app/entities/local-share/InsuranceEvent';
import { HttpResponse } from '@angular/common/http';
import { Client } from 'app/entities/client/client.model';
import { EhcSecondary } from 'app/entities/ehc/ehc-secondary.model';
import { EhcService } from '../../../ehc/service/ehc.service';
import { EhcPrimaryService } from '../../../ehc-primary/service/ehc-primary.service';
import { EhcClientService } from '../../../ehc-client/service/ehc-client.service';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { FormsModule } from '@angular/forms';
import ItemCountComponent from '../../../../shared/pagination/item-count.component';
import { NgForOf, NgIf } from '@angular/common';
import SharedModule from '../../../../shared/shared.module';
import { SortByDirective, SortDirective } from '../../../../shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../../shared/date';
@Component({
  standalone: true,
  selector: 'bc-ehc-secondary-add',
  templateUrl: './ehc-secondary-add.component.html',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
  ],
})
export class EhcSecondaryAddComponent implements OnInit {
  editMode = false;
  secondaryList!: EhcClient[];

  @Input()
  client!: Client;

  @Output()
  secondaryEmitter = new EventEmitter();

  @Output()
  summaryEventEmitter = new EventEmitter();

  @Output()
  secondaryEditEmitter = new EventEmitter<EhcClient>();

  ehcClients!: EhcClient[];
  selectedEhcClient!: EhcClient;

  // keeps EHC_IDs(primary) of the client

  // Ehc ids of the primary
  selectedPrimaryEhcIds!: number[];

  defaultPrimaryEhcIds!: number[];
  secondaryEhcIds?: number[] = [];

  eventSubscriber!: Subscription;
  currentSearch: string;
  primaries!: EhcPrimary[];
  links: any;
  totalItems: any;
  queryCount: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;

  disable = true;

  constructor(
    private ehcService: EhcService,
    private ehcPrimaryService: EhcPrimaryService,
    private ehcClientService: EhcClientService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 1;
    this.previousPage = 1;
    this.reverse = true;
    this.predicate = 'id';
  }
  ngOnInit() {
    this.ehcClientService.querySecondaryByClientId(this.client.id).subscribe(res => {
      const secondaryEhcClients: any = res.body;
      this.secondaryList = secondaryEhcClients;
      this.initClientEhcIds();
      this.loadAll();
    });
  }

  loadAll() {
    if (this.currentSearch) {
      this.ehcPrimaryService
        .searchPrimaryOtherClient(
          {
            query: this.currentSearch,
            size: this.itemsPerPage,
          },
          this.client.id,
        )
        .subscribe((res: HttpResponse<EhcPrimary[]>) => this.onSuccess(res.body, res.headers));
      return;
    } else {
      this.ehcPrimaryService
        .queryPrimaryOtherClient(
          {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
          },
          this.client.id,
        )
        .subscribe((res: HttpResponse<EhcPrimary[]>) => this.onSuccess(res.body, res.headers));
    }
  }

  search(query: string) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadAll();
  }

  // run only at startup keeps the Ehc to add and remove later for saving/deleting
  initClientEhcIds() {
    if (this.secondaryList) {
      this.selectedPrimaryEhcIds = [];
      this.defaultPrimaryEhcIds = [];
      this.secondaryList.forEach(p => {
        if (p.ehcId != null) {
          this.selectedPrimaryEhcIds.push(p.ehcId);
          this.defaultPrimaryEhcIds.push(p.ehcId);
        }
      });
    }
  }

  trackId(index: number, item: EhcPrimary) {
    return item.id;
  }

  addOrRemoveFromPrimary(primary: EhcPrimary, event: Event) {
    const target = event.target as HTMLInputElement;
    const eventType: InsuranceEventType = target.checked
      ? InsuranceEventType.EHC_PRIMARY_SELECTED
      : InsuranceEventType.EHC_PRIMARY_UNSELECTED;
    switch (eventType) {
      case InsuranceEventType.EHC_PRIMARY_UNSELECTED: {
        const foundEhcId: number | undefined = this.selectedPrimaryEhcIds.find(item => item === primary.ehcId);
        if (foundEhcId) {
          const ehcIds = this.selectedPrimaryEhcIds.filter(item => item !== foundEhcId);
          this.selectedPrimaryEhcIds = ehcIds;
        }
        this.initSave();
        break;
      }

      case InsuranceEventType.EHC_PRIMARY_SELECTED: {
        const foundPrimaryToAdd: EhcPrimary | undefined = this.primaries.find(item => item.ehcId === primary.ehcId);
        const foundId = this.selectedPrimaryEhcIds.find(p => p === foundPrimaryToAdd?.ehcId);
        if (!foundId) {
          if (!this.selectedPrimaryEhcIds || this.selectedPrimaryEhcIds === null) {
            this.selectedPrimaryEhcIds = [];
          }
          if (foundPrimaryToAdd && foundPrimaryToAdd.ehcId) {
            this.selectedPrimaryEhcIds.push(foundPrimaryToAdd.ehcId);
          }
        }
        this.initSave();
        break;
      }

      default:
        this.initSave();
        break;
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<EhcClient[]>>): void {
    result.subscribe(res => this.onSaveSuccess(res));
  }

  /**
   *
   * @param res we get list of Secondary only
   * @private
   */
  private onSaveSuccess(res: HttpResponse<EhcClient[]>) {
    const secondaryList: EhcClient[] = res.body as EhcClient[];
    this.secondaryList = secondaryList;
    this.selectedPrimaryEhcIds = [];
    this.defaultPrimaryEhcIds = [];

    if (secondaryList) {
      this.secondaryList.forEach(p => {
        if (p.ehcId) {
          this.selectedPrimaryEhcIds.push(p.ehcId);
          this.defaultPrimaryEhcIds.push(p.ehcId);
        }
      });
    }
    this.disable = true;
    this.loadAll();
    this.summaryEventEmitter.emit();
  }

  private onSuccess(data: any, headers: any) {
    // this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = headers.get('X-Total-Count');
    this.queryCount = this.totalItems;
    this.primaries = data;
  }

  private onDeleteSuccess() {
    this.loadAll();
  }

  isSelected(primary: EhcPrimary): boolean {
    const id: any = primary.ehcId;

    return this.secondaryList.some(item => item.ehcId === id);
  }
  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.loadAll();
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.loadAll();
    }
  }
  backToEhc() {
    this.secondaryEmitter.emit();
  }

  /**
   * We send all primary that are checked(selected) not only 1 that is selected , 1 plus any other selected
   *
   */
  save() {
    const ehcSecondary = new EhcSecondary();
    ehcSecondary.ehcIds = this.selectedPrimaryEhcIds;
    ehcSecondary.clientId = this.client.id;
    ehcSecondary.ehcType = 'Secondary';
    ehcSecondary.status = 'Active';

    this.subscribeToSaveResponse(this.ehcClientService.createOrDelete(ehcSecondary));
  }
  initSave() {
    const selectedEhcIdsSize = this.selectedPrimaryEhcIds ? this.selectedPrimaryEhcIds.length : 0;
    const defaultEhcIdsSize = this.defaultPrimaryEhcIds ? this.defaultPrimaryEhcIds.length : 0;

    if (defaultEhcIdsSize !== selectedEhcIdsSize) {
      this.disable = false;
      return;
    }

    this.defaultPrimaryEhcIds.forEach(item1 => {
      const found = this.selectedPrimaryEhcIds.find(x1 => x1 === item1);
      if (!found) {
        this.disable = false;
        return;
      }
    });

    this.selectedPrimaryEhcIds.forEach(item2 => {
      const found = this.defaultPrimaryEhcIds.find(x2 => x2 === item2);
      if (!found) {
        this.disable = false;
        return;
      }
    });

    this.disable = true;
  }
  checkEditMode(checked: Boolean) {
    if (checked) {
      this.editMode = true;
    } else {
      this.editMode = false;
      return false;
    }
    this.editMode = false;
    return false;
  }

  goToSecondaryEdit(primary: EhcPrimary) {
    const selectedSecondary = this.secondaryList.find(item => item.ehcId === primary.ehcId);
    if (selectedSecondary) {
      selectedSecondary.primary = primary;
      this.secondaryEditEmitter.emit(selectedSecondary);
    }
  }
}
