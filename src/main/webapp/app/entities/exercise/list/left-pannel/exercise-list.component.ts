import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data, RouterModule } from '@angular/router';
import { Subscription, combineLatest, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SortByDirective } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ItemCountComponent } from 'app/shared/pagination';
import { FormsModule } from '@angular/forms';
import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { Media } from 'app/entities/media/media.model';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { ExerciseMedia } from 'app/entities/exercise/exercise-media.model';
import { ExerciseService } from '../../service/exercise.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import SharedModule from '../../../../shared/shared.module';
import SortDirective from '../../../../shared/sort/sort.directive';
@Component({
  standalone: true,
  selector: 'bc-exercise-list',
  templateUrl: './exercise-list.component.html',
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
export class ExerciseListComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @Output()
  deleteExerEmitter = new EventEmitter<Exercise>();
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

  constructor(
    protected exerciseService: ExerciseService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    public ngIf: NgIf,
    public ngFor: NgFor<any>,
  ) {}
  ngOnInit(): void {
    this.handleNavigation();
    this.loadPage();
    // this.registerChangeInExercises();
  }

  loadPageFromParent() {
    this.loadPage(this.page);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackId(index: number, item: Exercise): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  // registerChangeInExercises(): void {
  //   this.eventSubscriber = this.eventManager.subscribe('exerciseListModification', () => this.loadPage());
  // }

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
}
