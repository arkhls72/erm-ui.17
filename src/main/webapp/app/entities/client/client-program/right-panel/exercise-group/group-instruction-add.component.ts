import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Data, ParamMap } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';

import { Instruction } from 'app/entities/instruction/instruction.model';

import { ExerGroupWrapper } from 'app/entities/exer-group/exer-group-wrapper.model';

import { Prog } from 'app/entities/prog/prog.model';
import { ProgGroupInstruction } from 'app/entities/prog-group-instruction/prog-group-instruction.model';
import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { LocalStorageTree } from 'app/entities/local-share/cache/local-storage.tree';
import { ITEMS_PER_PAGE } from '../../../../../config/pagination.constants';
import { InstructionService } from '../../../../instruction/service/instruction.service';
import { ProgGroupInstructionService } from '../../../../prog-group-instruction/service/prog-group-instruction.service';
import { DATE_TIME_FORMAT } from '../../../../../config/input.constants';
import dayjs from 'dayjs/esm';
import SharedModule from '../../../../../shared/shared.module';
import { SortByDirective, SortDirective } from '../../../../../shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../../../shared/date';
import { ItemCountComponent } from '../../../../../shared/pagination';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  standalone: true,
  selector: 'bc-group-instruction-add',
  templateUrl: './group-instruction-add.component.html',
  imports: [
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
    ReactiveFormsModule,
    FaIconComponent,
  ],
})
export class GroupInstructionAddComponent implements OnInit {
  editMode = false;
  addMode = false;
  durations: string[] = ['Daily', 'Weekly', 'Monthly'];

  selectedInstruction!: Instruction | null;

  @Output()
  cancelInstructionEmitter = new EventEmitter();

  @Output()
  cancelAddInstructionEmitter = new EventEmitter();

  @Output()
  addInstructionEmitter = new EventEmitter();

  @Output()
  deleteInstructionEmitter = new EventEmitter<Instruction>();

  @Output()
  updateTreeEmitter = new EventEmitter();

  @Input()
  exerGroupWrapper!: ExerGroupWrapper;

  @Input()
  selectedExerciseGroup!: ExerGroup;

  progGroupInstruction!: ProgGroupInstruction;
  @Input()
  selectedProg!: Prog;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  instructions!: Instruction[];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    repeat: [null, [Validators.required]],
    hold: [null, [Validators.required]],
    complete: [null, [Validators.required]],
    perform: [null, [Validators.required]],
    note: [null, [Validators.maxLength(350)]],
    durationNumber: [null, [Validators.required]],
    duration: [null, [Validators.required]],
    exerciseId: [],
    lastModifiedDate: [],
  });

  constructor(
    protected instructionService: InstructionService,
    protected progGroupInstructionService: ProgGroupInstructionService,
    protected activatedRoute: ActivatedRoute,
    protected cacheTree: LocalStorageTree,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.loadCurrentProgGroupInstruction();
    this.handleNavigation();
  }

  loadCurrentProgGroupInstruction() {
    if (this.selectedProg && this.exerGroupWrapper) {
      this.progGroupInstructionService.findByProgExercise(this.selectedProg.id, this.exerGroupWrapper.exerciseId).subscribe(res => {
        if (res && res.body) {
          this.progGroupInstruction = res.body;
          if (this.progGroupInstruction && this.progGroupInstruction.instruction) {
            this.selectedInstruction = this.progGroupInstruction.instruction;
            this.updateForm(this.progGroupInstruction.instruction);
          }
        }
      });
    }
  }
  // no exerciseId or exercise being sent to instruction table due to unique constraint
  updateForm(instruction: any): void {
    if (instruction) {
      this.editForm.patchValue({
        id: instruction.id,
        name: instruction.name,
        repeat: instruction.repeat,
        hold: instruction.hold,
        complete: instruction.complete,
        perform: instruction.perform,
        note: instruction.note,
        durationNumber: instruction.durationNumber,
        duration: instruction.duration,
        lastModifiedDate: instruction.lastModifiedDate ? instruction.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      });
    }
  }
  previousState(): void {
    window.history.back();
  }

  save(): void {
    const instruction = this.createInstructionForm();
    let target: ProgGroupInstruction = {} as ProgGroupInstruction;
    if (this.progGroupInstruction) {
      target = this.progGroupInstruction;
    }
    target.instruction = instruction;
    target.exerciseId = this.exerGroupWrapper.exercise!.id;
    target.progId = this.selectedProg.id;
    target.groupId = this.selectedExerciseGroup.id;

    if (!this.progGroupInstruction || !this.progGroupInstruction.id) {
      this.subscribeToSaveResponse(this.progGroupInstructionService.create(target));
    } else {
      this.subscribeToSaveResponse(this.progGroupInstructionService.update(target));
    }
  }
  // no exerciseId or Exercise object being populated here  due to unique constraint
  private createInstructionForm(): Instruction {
    return {
      ...new Instruction(),
      id: this.selectedInstruction ? this.selectedInstruction.id : undefined,
      name: this.editForm.get(['name'])!.value,
      repeat: this.editForm.get(['repeat'])!.value,
      hold: this.editForm.get(['hold'])!.value,
      complete: this.editForm.get(['complete'])!.value,
      perform: this.editForm.get(['perform'])!.value,
      note: this.editForm.get(['note'])!.value,
      durationNumber: this.editForm.get(['durationNumber'])!.value,
      duration: this.editForm.get(['duration'])!.value,
      lastModifiedDate: this.editForm.get(['lastModifiedDate'])!.value
        ? dayjs(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProgGroupInstruction>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body));
  }

  protected onSaveSuccess(data: ProgGroupInstruction | null): void {
    if (data) {
      // first we set the progGroupInstruction
      this.progGroupInstruction = data;
      if (data.instruction) {
        this.selectedInstruction = data.instruction;
        this.updateForm(this.selectedInstruction);
        // update cacheTree with new values
        const tree = this.cacheTree.getTreeGroup();
        // if there is no data cache means it is the first time
        if (!tree) {
          this.updateTreeEmitter.emit();
        } else {
          const cacheProgInstrcution = tree.progGroupInstructions;
          // cache is empty
          if (!cacheProgInstrcution || cacheProgInstrcution.length === 0) {
            // push the first element in to cache
            tree.progGroupInstructions = [];
            tree.progGroupInstructions.push(data);
            this.cacheTree.addTreeGroup(tree);
          } else {
            // cache is not empty search the element
            let isFound = false;
            cacheProgInstrcution.forEach(item => {
              // if the element is found in cache then replace it in the LIST
              if (item.id === data.id) {
                item.instruction = data.instruction;
                isFound = true;
              }
            });
            // if not found in the cache it then add it
            if (!isFound) {
              cacheProgInstrcution.push(data);
            }
            // replace the entire cache list with fresh LIST
            tree.progGroupInstructions = [];
            tree.progGroupInstructions = cacheProgInstrcution;
            this.cacheTree.addTreeGroup(tree);
          }
        }
      }
      this.addMode = true;
      this.editMode = true;
    }
  }

  cancelInstruction() {
    this.selectedInstruction = null;
    this.cancelInstructionEmitter.emit();
  }

  // changeDuration(duration: Event) {
  //   this.editForm.patchValue({
  //     duration: duration.currentTarget,
  //   });
  // }
  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.editMode = true;
      return true;
    } else {
      this.editMode = false;
      return false;
    }
  }
  addNewInstruction() {
    this.addInstructionEmitter.emit(this.exerGroupWrapper);
  }
  // replacement of ngOnEdit()
  initUpdateFormByParent(instruction: Instruction) {
    this.updateForm(instruction);
  }

  // calls from parent exer-group-detail
  initNewFormByParent(exerGroupWrapper: ExerGroupWrapper) {
    this.editMode = false;

    if (exerGroupWrapper) {
      this.exerGroupWrapper = exerGroupWrapper;
    }
    this.exerGroupWrapper = exerGroupWrapper;
    let instruction = exerGroupWrapper.instruction;
    if (!instruction) {
      instruction = new Instruction();
    }
    this.updateForm(instruction);
    this.addMode = true;
    this.editMode = true;
  }
  defaultDuration(duration: string) {
    const formDuration = this.editForm.get(['duration'])!.value;
    if (formDuration === duration) {
      return true;
    }
    return false;
  }

  cancelAdd() {
    this.addMode = false;
    this.editMode = false;
  }
  loadInstruction(page?: number) {
    const pageToLoad: number = page || page || 1;
    this.instructionService
      .findByGroupExerciseIdPageable(
        {
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        },
        this.exerGroupWrapper.exerciseId,
        this.exerGroupWrapper.exerGroupId,
      )
      .subscribe((res: HttpResponse<Instruction[]>) => this.onSuccess(res.body, res.headers, pageToLoad));
  }
  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }
  protected onSuccess(data: Instruction[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (data) {
      this.instructions = data;
    } else {
      this.selectedInstruction = new Instruction();
    }
    this.ngbPaginationPage = this.page;
  }

  changeInstruction(instruction: Instruction) {
    this.selectedInstruction = instruction;
    const x: any = document.getElementById('editCheck');

    if (x.checked) {
      const newInstruction = instruction;
      // chek if already exists.
      newInstruction.id = undefined;
      this.updateForm(newInstruction);
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
        this.loadInstruction(pageNumber);
      }
    }).subscribe();
  }
  initLoadInstructions() {
    if (this.page) {
      this.loadInstruction(this.page);
    } else {
      this.loadInstruction(1);
    }
  }
  trackId(index: number, item: Instruction): number {
    return item.id!;
  }

  delete(instruction?: Instruction) {
    if (instruction && instruction.id) {
      this.deleteInstructionEmitter.emit(instruction);
    }
  }
}
