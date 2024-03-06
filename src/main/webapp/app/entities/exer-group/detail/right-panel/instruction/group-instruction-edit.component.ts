import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Data, ParamMap, RouterModule } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';

import { Instruction } from 'app/entities/instruction/instruction.model';

import { ExerGroupWrapper } from 'app/entities/exer-group/exer-group-wrapper.model';
import { ITEMS_PER_PAGE } from '../../../../../config/pagination.constants';
import { InstructionService } from '../../../../instruction/service/instruction.service';
import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from '../../../../../config/input.constants';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import SortDirective from '../../../../../shared/sort/sort.directive';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-group-instruction-edit',
  templateUrl: './group-instruction-edit.component.html',
  imports: [FaIconComponent, ReactiveFormsModule, SortDirective, NgIf, NgForOf],
})
export class GroupInstructionEditComponent implements OnInit {
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

  @Input()
  exerGroupWrapper!: ExerGroupWrapper;

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
    repeat: [],
    hold: [],
    complete: [],
    perform: [],
    note: [null, [Validators.maxLength(350)]],
    durationNumber: [],
    duration: [],
    exerciseId: [],
    lastModifiedDate: [],
  });

  constructor(
    protected instructionService: InstructionService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.handleNavigation();
  }

  updateForm(instruction: any): void {
    instruction.exerciseId = this.exerGroupWrapper.exerciseId;
    if (this.exerGroupWrapper && this.exerGroupWrapper.exerciseId) {
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
        exerciseId: instruction.exerciseId,
        lastModifiedDate: instruction.lastModifiedDate ? instruction.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
      });
    }
  }
  previousState(): void {
    window.history.back();
  }

  save(): void {
    const instruction = this.createFromForm();
    if (this.exerGroupWrapper && this.exerGroupWrapper.exerciseId) {
      instruction.lastModifiedDate = undefined;
      if (instruction.id) {
        this.subscribeToSaveResponse(this.instructionService.update(instruction));
      } else {
        const target = new ExerGroupWrapper();
        target.instruction = instruction;
        target.exerciseId = this.exerGroupWrapper.exercise!.id;
        target.exerGroupId = this.exerGroupWrapper.exerGroupId;
        target.exerGroupDetailId = this.exerGroupWrapper.exerGroupDetailId;
        this.subscribeToSaveResponseWrapper(this.instructionService.createByGroup(target));
      }
    }
  }

  private createFromForm(): Instruction {
    return {
      ...new Instruction(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      repeat: this.editForm.get(['repeat'])!.value,
      hold: this.editForm.get(['hold'])!.value,
      complete: this.editForm.get(['complete'])!.value,
      perform: this.editForm.get(['perform'])!.value,
      note: this.editForm.get(['note'])!.value,
      durationNumber: this.editForm.get(['durationNumber'])!.value,
      duration: this.editForm.get(['duration'])!.value,
      exerciseId: this.exerGroupWrapper && this.exerGroupWrapper.exerciseId ? this.exerGroupWrapper.exerciseId : undefined,
      lastModifiedDate: this.editForm.get(['lastModifiedDate'])!.value
        ? dayjs(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Instruction>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body));
  }

  protected subscribeToSaveResponseWrapper(result: Observable<HttpResponse<ExerGroupWrapper>>): void {
    result.subscribe(res => this.onSaveSuccessWrapper(res.body));
  }
  protected onSaveSuccessWrapper(exerGroupWrapper: ExerGroupWrapper | null): void {
    if (exerGroupWrapper && exerGroupWrapper.instruction) {
      const instruction = exerGroupWrapper.instruction;
      this.selectedInstruction = instruction;
      this.updateForm(this.selectedInstruction);
      this.addMode = false;
      this.editMode = false;
      this.initLoadInstructions();
      this.resetSlideButtons();
    }
  }

  protected onSaveSuccess(instruction: Instruction | null): void {
    if (instruction) {
      this.selectedInstruction = instruction;
      this.updateForm(this.selectedInstruction);
      this.addMode = false;
      this.editMode = false;
      this.initLoadInstructions();
      this.resetSlideButtons();
    }
  }
  cancelInstruction() {
    this.selectedInstruction = null;
    this.cancelInstructionEmitter.emit();
  }
  //duration: Event
  changeDuration(duration: any) {
    this.editForm.patchValue({
      duration: duration.currentTarget,
    });
  }
  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!this.selectedInstruction) {
      return false;
    }

    if (!target.checked) {
      this.editMode = false;
      return false;
    }
    this.editMode = target.checked;
    return this.editMode;
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

    if (data && data[0]) {
      this.instructions = data;
      this.selectedInstruction = data[0];
      this.changeInstruction(this.selectedInstruction);
    } else {
      this.selectedInstruction = new Instruction();
      this.updateForm(this.selectedInstruction);
    }

    this.ngbPaginationPage = this.page;
  }
  changeInstruction(instruction: Instruction) {
    this.selectedInstruction = instruction;
    this.updateForm(instruction);
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

  resetSlideButtons() {
    const radio: any = document.getElementById('editCheck');
    if (radio) {
      radio.checked = false;
    }
  }
}
