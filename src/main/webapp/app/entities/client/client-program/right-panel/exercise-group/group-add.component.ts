import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data } from '@angular/router';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { Client } from 'app/entities/client/client.model';
import { WrapperProg } from 'app/entities/exer-group/wrapper-prog.model';
import { Prog } from 'app/entities/prog/prog.model';
import { ExerGroupService } from '../../../../exer-group/service/exer-group.service';
import { ProgExerGroupService } from '../../../../prog-exer-group/service/prog-exer-group.service';
import { ITEMS_PER_PAGE } from '../../../../../config/pagination.constants';
import { FormsModule } from '@angular/forms';
import SharedModule from '../../../../../shared/shared.module';
import { SortByDirective, SortDirective } from '../../../../../shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../../../shared/date';
import { ItemCountComponent } from '../../../../../shared/pagination';

@Component({
  standalone: true,
  selector: 'bc-group-add',
  templateUrl: './group-add.component.html',
  imports: [
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
export class GroupAddComponent implements OnInit {
  @Input()
  client!: Client;

  @Input()
  selectedProg!: Prog;

  @Output()
  selectedGroupEmitter = new EventEmitter<ExerGroup>();

  @Output()
  updateTreeEmitter = new EventEmitter();

  isSaveMode = false;
  exerGroups?: ExerGroup[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  currentSearch!: string;
  // This is the list that will be passed to backend uppon save() button push and being saved
  currentExerGroupIds?: number[];

  // This is the list that will be passed to backend uppon save() button push and being saved
  persistedCheckedIds: number[] = [];

  checked = false;
  // holds the Id of exerGroup

  constructor(
    protected exerGroupService: ExerGroupService,
    protected progExerGroupService: ProgExerGroupService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    if (this.client) {
      this.progExerGroupService.findByProgId(this.selectedProg.id).subscribe(res => {
        if (res.body && res.body.exerGroupIds) {
          this.currentExerGroupIds = res.body.exerGroupIds;
          this.initPersistentCheckIds();
        }
      });
    }
    this.handleNavigation();
  }

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page || 1;
    if (!this.currentSearch) {
      if (this.checked) {
        this.exerGroupService
          .queryByProg({
            page: pageToLoad - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
            id: this.selectedProg.id,
          })
          .subscribe(
            (res: HttpResponse<ExerGroup[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
            () => this.onError(),
          );
      } else {
        this.exerGroupService
          .query({
            page: pageToLoad - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
            id: this.checked ? this.selectedProg.id : '',
          })
          .subscribe(
            (res: HttpResponse<ExerGroup[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
            () => this.onError(),
          );
      }
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
        this.loadPage(pageNumber);
      }
    }).subscribe();
  }
  trackId(index: number, item: ExerGroup): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  delete(exerGroup: ExerGroup): void {
    this.selectedGroupEmitter.emit(exerGroup);
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
    this.uncheckedCheckBox();

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

  checkUnCheck(event: Event) {
    const target = event.target as HTMLInputElement;
    const x = target.checked ? true : false;
    this.page = 1;
    if (target.checked) {
      this.checked = true;
      this.loadPage(this.page);
    } else {
      this.checked = false;
      this.loadPage(this.page);
    }
  }

  isSelected(exerGroup: ExerGroup): boolean {
    if (!this.currentExerGroupIds) {
      this.currentExerGroupIds = [];
    }
    const found = this.currentExerGroupIds.find(item => item === exerGroup.id);
    if (found) {
      return true;
    }
    return false;
  }

  addOrRemoveExerGroup(exerGroup: ExerGroup, event: Event) {
    if (!this.currentExerGroupIds) {
      this.currentExerGroupIds = [];
    }
    const target = event.target as HTMLInputElement;
    const found = this.currentExerGroupIds.find(item => item === exerGroup.id);
    if (target.checked) {
      if (!found && exerGroup.id) {
        this.currentExerGroupIds.push(exerGroup.id);
      }
    } else {
      if (found) {
        const filtered = this.currentExerGroupIds.filter(item => item !== exerGroup.id);
        this.currentExerGroupIds = filtered;
      }
    }
    this.isSaveMode = this.ifSaveModeChanged();
  }

  save() {
    if (!this.currentExerGroupIds) {
      this.currentExerGroupIds = [];
    }
    const wrapper: WrapperProg = new WrapperProg();
    wrapper.exerGroupIds = this.currentExerGroupIds;
    this.subscribeToSaveResponse(this.progExerGroupService.updateByProg(wrapper, this.selectedProg.id));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<WrapperProg>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body));
  }

  protected onSaveSuccess(result: WrapperProg | null): void {
    if (result) {
      this.currentExerGroupIds = result.exerGroupIds;
      this.initPersistentCheckIds();
      this.isSaveMode = false;
      this.updateTreeEmitter.emit();
    }
  }

  // After saving ExerGroupIds in to Program, It'll save the exerGroupIds in to persistedCheckIds
  initPersistentCheckIds() {
    this.persistedCheckedIds = [];
    if (this.currentExerGroupIds) {
      this.currentExerGroupIds.forEach(i => {
        this.persistedCheckedIds.push(i);
      });
    }
  }

  isPersisted(ex: ExerGroup) {
    if (!this.persistedCheckedIds) {
      return false;
    }
    const found = this.persistedCheckedIds.find(item => item === ex.id);
    if (found) {
      return true;
    }

    return false;
  }

  ifSaveModeChanged() {
    const persistSize = !this.persistedCheckedIds ? 0 : this.persistedCheckedIds.length;
    const currentExerGroupIdsSize = !this.currentExerGroupIds ? 0 : this.currentExerGroupIds.length;
    if (persistSize !== currentExerGroupIdsSize) {
      return true;
    }
    this.persistedCheckedIds = !this.persistedCheckedIds ? [] : this.persistedCheckedIds;
    this.currentExerGroupIds = !this.currentExerGroupIds ? [] : this.currentExerGroupIds;
    let result = false;
    this.currentExerGroupIds.forEach((ex: number) => {
      const found = this.persistedCheckedIds?.find(c => c === ex);
      if (!found) {
        result = true;
      }
    });

    return result;
  }

  initFromParent(prog: Prog) {
    this.selectedProg = prog;
    this.ngOnInit();
  }
  uncheckedCheckBox() {
    const x: any = document.getElementById('checkUncheck');
    x.checked = false;
    this.checked = false;
  }
  ngOnInstructionGroup(exerGroup: ExerGroup) {
    this.selectedGroupEmitter.emit(exerGroup);
  }
}
