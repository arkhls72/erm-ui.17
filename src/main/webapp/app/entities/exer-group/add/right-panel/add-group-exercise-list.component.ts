import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data, RouterLink } from '@angular/router';
import { Subscription, combineLatest, Observable, Subject } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Media } from 'app/entities/media/media.model';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { ExerciseMedia } from 'app/entities/exercise/exercise-media.model';

import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { ExerciseService } from '../../../exercise/service/exercise.service';
import { ExerGroupDetaillService } from '../../../exer-group-detaill/service/exer-group-detaill.service';
import { ExerGroupDetailWrapper } from '../../../exer-group-detaill/exer-group-detail-wrapper.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'bc-add-group-exercise-list',
  templateUrl: './add-group-exercise-list.component.html',
  imports: [FormsModule, RouterLink],
  standalone: true,
})
export class AddGroupExerciseListComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @Output()
  deleteExerEmitter = new EventEmitter<Exercise>();
  // passes only after edit, in create mode needs to be saved at least once.
  // in left page: group-desc-add once new group Exercise created this will be passed  here from left to right and list
  // of exerciseIds will be received.
  @Input()
  selectedExerGroup!: ExerGroup;

  currentExerciseIds: number[] | undefined = [];

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
    this.loadExerciseDetail();
    // it will run here to ensure the exercise list checkboxes are initialzied.
    this.handleNavigation();
  }

  loadExerciseDetail() {
    if (this.selectedExerGroup && this.selectedExerGroup.id) {
      this.groupDetailService.findMapExerciseByGroupId(this.selectedExerGroup.id).subscribe(
        (res: HttpResponse<ExerGroupDetailWrapper>) => this.onSuccessDetail(res.body),
        () => this.onError(),
      );
    }
  }

  loadPage(page?: number): void {
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
        this.loadPage(pageNumber);
      }
    }).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackId(index: number, item: Exercise): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  delete(exercise: Exercise): void {
    this.deleteExerEmitter.emit(exercise);
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: Exercise[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;

    this.router.navigate(['/exercise'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
      },
    });

    this.exercises = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onSuccessDetail(data: ExerGroupDetailWrapper | null) {
    if (data && data.exerciseIds) {
      this.currentExerciseIds = data.exerciseIds;
      this.isEditMode = true;
    } else {
      this.currentExerciseIds = [];
    }
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
    this.loadPage(this.page);
  }

  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.router.navigate([
      '/exercise',
      {
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
      },
    ]);
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

  addOrRemovePrimary(exercise: Exercise, event: Event) {
    const target = event.target as HTMLInputElement;

    if (!this.currentExerciseIds) {
      this.currentExerciseIds = [];
    }
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
    this.isSaveMode = true;
  }

  initSelectedExerciseGroup(exerGroup: ExerGroup) {
    this.selectedExerGroup = exerGroup;
    this.isEditMode = true;
    this.loadExerciseDetail();
  }

  saveToGroup() {
    const target = new ExerGroupDetailWrapper();
    target.exerciseIds = this.currentExerciseIds;
    target.exerGroupId = this.selectedExerGroup.id;
    this.subscribeToSaveResponse(this.groupDetailService.updateExerciseByGroupId(target));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ExerGroupDetailWrapper>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body));
  }

  protected onSaveSuccess(res?: ExerGroupDetailWrapper | null): void {
    if (res) {
      this.currentExerciseIds = res.exerciseIds ? res.exerciseIds : [];
    }
  }
}
