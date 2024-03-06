import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { Instruction } from 'app/entities/instruction/instruction.model';
import { DatePipe, NgIf } from '@angular/common';
import { ExerGroupService } from '../../service/exer-group.service';
import { InstructionService } from '../../../instruction/service/instruction.service';
import { DATE_TIME_FORMAT } from '../../../../config/input.constants';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'bc-group-instruction-info',
  templateUrl: './group-instruction-info.component.html',
  imports: [ReactiveFormsModule, FormsModule, NgIf],
})
export class GroupInstructionInfoComponent implements OnInit {
  isSaving = false;
  exerGroup!: ExerGroup;

  @Input()
  exercise!: Exercise;
  // pagination items
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  instructions!: Instruction[];
  selectedInstruction!: Instruction | null;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    description: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(250)]],
    lastModifiedBy: [],
    lastModifiedDate: [],
    createdBy: [],
    createdDate: [],
  });

  constructor(
    protected exerGroupService: ExerGroupService,
    protected instructionService: InstructionService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    if (this.exercise) {
      const last = this.exercise.lastModifiedDate;
      if (last) {
        // this.exercise.lastModifiedDate = this.datePipe.transform(last, 'yyyy-MM-dd hh:mm a');
      }
    }

    this.activatedRoute.data.subscribe(({ exerGroup }) => {
      if (!exerGroup.id) {
        const today = dayjs().startOf('day');
        exerGroup.lastModifiedDate = today;
        exerGroup.createdDate = today;
      }
      this.exerGroup = exerGroup;
      this.updateForm(exerGroup);
    });
  }

  updateForm(exerGroup: any): void {
    this.editForm.patchValue({
      id: exerGroup.id,
      name: exerGroup.name,
      description: exerGroup.description,
      lastModifiedBy: exerGroup.lastModifiedBy,
      lastModifiedDate: exerGroup.lastModifiedDate ? exerGroup.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
      createdBy: exerGroup.createdBy,
      createdDate: exerGroup.createdDate ? exerGroup.createdDate.format(DATE_TIME_FORMAT) : null,
    });
  }

  previousState(): void {
    window.history.back();
  }
}
