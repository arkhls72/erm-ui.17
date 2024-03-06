import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ActivatedRoute, Data, ParamMap, Router, RouterLink, RouterModule } from '@angular/router';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { Media } from 'app/entities/media/media.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ExerciseMedia } from 'app/entities/exercise/exercise-media.model';
import { Prog } from 'app/entities/prog/prog.model';
import { ProgExerciseWrapper } from 'app/entities/exer-group/exer-prog-wrapper.model';
import { Instruction } from 'app/entities/instruction/instruction.model';

import { LocalStorageTree } from 'app/entities/local-share/cache/local-storage.tree';
import { ProgExerciseInstruction } from '../../../../prog-exercise-instruction/prog-exercise-instruction.model';
import { ITEMS_PER_PAGE } from '../../../../../config/pagination.constants';
import { ExerciseService } from '../../../../exercise/service/exercise.service';
import { ProgExerciseInstructionService } from '../../../../prog-exercise-instruction/service/prog-exercise-instruction.service';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { ItemCountComponent } from '../../../../../shared/pagination';
import SharedModule from '../../../../../shared/shared.module';
import SortDirective from '../../../../../shared/sort/sort.directive';
import { SortByDirective } from '../../../../../shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../../../shared/date';
import { ExerGroupDetailWrapper } from '../../../../exer-group-detaill/exer-group-detail-wrapper.model';

@Component({
  standalone: true,
  selector: 'bc-exercise-select',
  templateUrl: './exercise-select.component.html',
  imports: [
    FormsModule,
    RouterLink,
    FaIconComponent,
    CommonModule,
    ItemCountComponent,
    RouterModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    SortDirective,
  ],
})
export class ExerciseSelectComponent implements OnInit {
  @Input()
  selectedProg!: Prog;

  @Output()
  deleteExerEmitter = new EventEmitter<Exercise>();

  @Output()
  initCacheEmitter = new EventEmitter();

  @Output()
  instructionEmitter = new EventEmitter<Exercise>();

  selectedProgExerciseWrapper!: ProgExerciseWrapper;

  currentExerciseIds: number[] | undefined = [];

  progExerciseInstructions!: ProgExerciseInstruction[];

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
  selectedInstruction!: Instruction;
  selectedExercise!: Exercise;

  // flag to enable/disable save button for bulk save.
  isEditMode = true;
  isSaveMode = false;
  constructor(
    protected exerciseService: ExerciseService,
    protected progExerciseInstructionService: ProgExerciseInstructionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.loadProgExercise();
    // it will run here to ensure the exercise list checkboxes are initialzied.
    this.handleNavigation();
  }

  loadProgExercise() {
    if (this.selectedProg) {
      this.progExerciseInstructionService.findWrapperByProg(this.selectedProg.id).subscribe(res => {
        if (res.body) {
          this.currentExerciseIds = res.body.exerciseIds;
          this.progExerciseInstructions = !res.body.progExerciseInstructions ? [] : res.body.progExerciseInstructions;
        }
      });
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
  // load exercise List  -
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

  save() {
    const target = new ProgExerciseWrapper();
    target.exerciseIds = this.currentExerciseIds;
    target.progId = this.selectedProg.id;
    // target.exerGroupId = this.selectedExerGroup.id;
    this.subscribeToSaveResponse(this.progExerciseInstructionService.createWithWrapper(target));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ExerGroupDetailWrapper>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body));
  }

  protected onSaveSuccess(res?: ExerGroupDetailWrapper | null): void {
    if (res) {
      this.currentExerciseIds = res.exerciseIds ? res.exerciseIds : [];
      this.initCacheEmitter.emit();
    }
  }
  isEnable(exercise: Exercise) {
    const found = this.currentExerciseIds?.find(item => item === exercise.id);
    if (found) {
      return false;
    }

    return true;
  }

  exerciseInstruction(exercise: Exercise) {
    this.instructionEmitter.emit(exercise);
  }
}
