import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data, RouterLink, RouterModule } from '@angular/router';
import { Subscription, combineLatest, Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { ExerciseMedia } from 'app/entities/exercise/exercise-media.model';
import { Media } from 'app/entities/media/media.model';
import { ExerGroupDetaill } from 'app/entities/exer-group-detaill/exer-group-detaill.model';
import { ExerGroupWrapper } from 'app/entities/exer-group/exer-group-wrapper.model';
import { ExerciseService } from '../../../exercise/service/exercise.service';
import { ExerGroupDetaillService } from '../../../exer-group-detaill/service/exer-group-detaill.service';
import { ExerGroupDetailWrapper } from '../../../exer-group-detaill/exer-group-detail-wrapper.model';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { ItemCountComponent } from '../../../../shared/pagination';
import SharedModule from '../../../../shared/shared.module';
import SortDirective from '../../../../shared/sort/sort.directive';
import { SortByDirective } from '../../../../shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../../shared/date';
import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
@Component({
  standalone: true,
  selector: 'bc-detail-exercise-list',
  templateUrl: './detail-exercise-list.component.html',
  imports: [
    FaIconComponent,
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
export class DetailExerciseListComponent implements OnInit {
  @Output()
  deleteExerEmitter = new EventEmitter<Exercise>();
  // passes only after edit, in create mode needs to be saved at least once.
  // in left page: group-desc-add once new group Exercise created this will be passed  here from left to right and list
  // of exerciseIds will be received.
  @Input()
  selectedExerciseGroup!: ExerGroup;

  persistedCheckedIds: number[] = [];
  @Output()
  deleteGroupExerciseDetail = new EventEmitter<ExerGroupDetaill>();

  @Output()
  editGroupInstruction = new EventEmitter<ExerGroupWrapper>();

  currentExerciseIds: number[] | undefined = [];
  exerGroupDetailMap = new Map<number, number>();

  exercises?: Exercise[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  currentSearch!: string;
  links: any;
  queryCount: any;
  previousPage: any;
  reverse: any;
  medias?: Media[];
  // flag to enable/disable save button for bulk save.
  isEditMode = false;
  isSaveMode = false;

  constructor(
    protected exerciseService: ExerciseService,
    protected groupDetailService: ExerGroupDetaillService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.loadMyExerciseInDetail();
    // it will run here to ensure the exercise list checkboxes are initialzied.
    this.handleNavigation();
  }

  loadMyExerciseInDetail() {
    if (this.selectedExerciseGroup) {
      this.groupDetailService.findMapExerciseByGroupId(this.selectedExerciseGroup.id).subscribe(
        (res: HttpResponse<ExerGroupDetailWrapper>) => this.onSuccessDetail(res.body),
        () => this.onError(),
      );
    }
  }

  loadExercisePage(page?: number): void {
    const pageToLoad: number = page || this.page || 1;
    if (this.currentSearch) {
      this.exerciseService
        .searchSummary({
          query: this.currentSearch,
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe(
          (res: HttpResponse<ExerciseMedia>) => this.onSuccessWithMedia(res.body, res.headers, pageToLoad),
          () => this.onError(),
        );
    } else {
      this.exerciseService
        .findSummaryMedia({
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe(
          (res: HttpResponse<ExerciseMedia>) => this.onSuccessWithMedia(res.body, res.headers, pageToLoad),
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
        this.loadExercisePage(pageNumber);
      }
    }).subscribe();
  }

  trackId(index: number, item: Exercise): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  delete(exercise: ExerGroupDetaill): void {
    if (exercise) {
      this.deleteGroupExerciseDetail.emit(exercise);
    }
  }

  goToInstructionManagement(exercise: Exercise) {
    const target = new ExerGroupWrapper();
    target.exercise = exercise;
    target.exerGroupId = this.selectedExerciseGroup.id;
    if (this.exerGroupDetailMap) {
      // Map
      for (const [key, value] of Object.entries(this.exerGroupDetailMap)) {
        if (exercise.id === Number(key)) {
          target.exerGroupDetailId = Number(value);
          break;
        }
      }
    }
    this.editGroupInstruction.emit(target);
  }
  isEnable(exercise: Exercise) {
    if (!this.currentExerciseIds) {
      this.currentExerciseIds = [];
    }
    const found = this.currentExerciseIds.find(item => item === exercise.id);
    if (found) {
      return false;
    }
    return true;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccessDetail(data: ExerGroupDetailWrapper | null) {
    if (data && data.exerciseIds) {
      this.currentExerciseIds = data.exerciseIds;
      if (data.exerGroupDetailMap) {
        this.exerGroupDetailMap = data.exerGroupDetailMap;
      }
      this.isEditMode = true;
    } else {
      this.currentExerciseIds = [];
    }
    // save a copy of saved ExerciseIds
    this.initPersistentCheckIds();
  }

  protected onSuccessWithMedia(data: ExerciseMedia | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;

    if (data) {
      this.exercises = data.exercises;
      this.medias = data.medias;
    }

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
    this.loadExercisePage(this.page);
  }

  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.loadAll();
  }

  loadAll() {
    const pageToLoad: number = this.page || this.page || 1;
    this.exerciseService
      .findSummaryMedia({
        query: this.currentSearch,
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ExerciseMedia>) => this.onSuccessWithMedia(res.body, res.headers, pageToLoad),
        () => this.onError(),
      );
  }

  addSrcMedia(mediaId?: number) {
    if (mediaId) {
      if (this.medias) {
        const findMedia = this.medias.find(p => p.id === mediaId);
        if (findMedia && findMedia.contentType) {
          return 'data:' + findMedia.contentType + ';base64,' + findMedia.value;
        }
      }
    }
    return null;
  }

  getMuscle(e: Exercise) {
    if (e.muscle) {
      return e.muscle.name;
    }
    return '';
  }

  getBodyPart(e: Exercise) {
    if (e.bodyPart) {
      return e.bodyPart.name;
    }
    return '';
  }

  isSelected(exercise: Exercise): boolean {
    if (!this.currentExerciseIds) {
      this.currentExerciseIds = [];
    }
    const found = this.currentExerciseIds.find(item => item === exercise.id);
    if (found) {
      return true;
    }
    return false;
  }

  addOrRemoveExercise(exercise: Exercise, event: Event) {
    if (!this.currentExerciseIds) {
      this.currentExerciseIds = [];
    }
    const target = event.target as HTMLInputElement;
    const found = this.currentExerciseIds.find(item => item === exercise.id);
    if (target.checked) {
      if (!found && exercise.id) {
        this.currentExerciseIds.push(exercise.id);
      }
    } else {
      if (found) {
        const filtered = this.currentExerciseIds.filter(item => item !== exercise.id);
        this.currentExerciseIds = filtered;
      }
    }
    this.isSaveMode = this.ifSaveModeChanged();
  }

  initSelectedExerciseGroup(exerGroup: ExerGroup) {
    this.selectedExerciseGroup = exerGroup;
    this.loadMyExerciseInDetail();
  }

  saveToGroup() {
    const target = new ExerGroupDetailWrapper();
    target.exerciseIds = this.currentExerciseIds;
    target.exerGroupId = this.selectedExerciseGroup.id;
    this.subscribeToSaveResponse(this.groupDetailService.updateExerciseByGroupId(target));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ExerGroupDetailWrapper>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body));
  }

  protected onSaveSuccess(res?: ExerGroupDetailWrapper | null): void {
    if (res) {
      this.currentExerciseIds = res.exerciseIds ? res.exerciseIds : [];
      this.initPersistentCheckIds();
    }
  }

  checkUnCheck(event: Event) {
    const target = event.target as HTMLInputElement;

    this.page = 1;
    if (target.checked) {
      this.loadExercisePageByIds();
    } else {
      // it will run here to ensure the exercise list checkboxes are initialzied.
      this.loadExercisePage(this.page);
    }
  }

  ifSaveModeChanged() {
    const currentSize = !this.persistedCheckedIds ? 0 : this.persistedCheckedIds.length;
    const exercisesIdsSize = !this.currentExerciseIds ? 0 : this.currentExerciseIds.length;
    if (currentSize !== exercisesIdsSize) {
      return true;
    }
    this.persistedCheckedIds = !this.persistedCheckedIds ? [] : this.persistedCheckedIds;
    this.currentExerciseIds = !this.currentExerciseIds ? [] : this.currentExerciseIds;
    let result = false;
    this.currentExerciseIds.forEach((ex: number) => {
      const found = this.persistedCheckedIds?.find(c => c === ex);
      if (!found) {
        result = true;
      }
    });

    return result;
  }

  loadExercisePageByIds(): void {
    const pageToLoad: number = this.page || 1;

    this.exerciseService
      .findSummaryByIds({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        ids: this.currentExerciseIds,
      })
      .subscribe(
        (res: HttpResponse<ExerciseMedia>) => this.onSuccessWithMedia(res.body, res.headers, pageToLoad),
        () => this.onError(),
      );
  }
  // calls after adding exerciseIds to ExerGroup and initialize persistedCheckedIds
  initPersistentCheckIds() {
    this.persistedCheckedIds = [];
    if (this.currentExerciseIds) {
      this.currentExerciseIds.forEach(i => {
        this.persistedCheckedIds.push(i);
      });
    }
  }
}
