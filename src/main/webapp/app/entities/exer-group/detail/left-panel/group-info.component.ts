import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ExerGroupService } from '../../service/exer-group.service';
import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from '../../../../config/input.constants';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-group-info',
  templateUrl: './group-info.component.html',
  imports: [ReactiveFormsModule, NgIf],
})
export class GroupInfoComponent implements OnInit {
  editMode = false;
  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    description: [null, [Validators.maxLength(250)]],
    lastModifiedBy: [],
    lastModifiedDate: [],
    createdBy: [],
    createdDate: [],
  });

  constructor(
    protected exerGroupService: ExerGroupService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exerGroup }) => {
      if (!exerGroup.id) {
        const today = dayjs().startOf('day');
        exerGroup.lastModifiedDate = today;
        exerGroup.createdDate = today;
      }

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

  save(): void {
    const exerGroup = this.createFromForm();
    if (exerGroup.id !== undefined) {
      this.subscribeToSaveResponse(this.exerGroupService.update(exerGroup));
    } else {
      this.subscribeToSaveResponse(this.exerGroupService.create(exerGroup));
    }
  }

  private createFromForm(): ExerGroup {
    const exerGroup = {} as ExerGroup;
    (exerGroup.id = this.editForm.get(['id'])!.value),
      (exerGroup.name = this.editForm.get(['name'])!.value),
      (exerGroup.description = this.editForm.get(['description'])!.value),
      (exerGroup.lastModifiedBy = this.editForm.get(['lastModifiedBy'])!.value),
      (exerGroup.lastModifiedDate = this.editForm.get(['lastModifiedDate'])!.value
        ? dayjs(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
        : null),
      (exerGroup.createdBy = this.editForm.get(['createdBy'])!.value),
      (exerGroup.createdDate = this.editForm.get(['createdDate'])!.value
        ? dayjs(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : null);

    return exerGroup;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ExerGroup>>): void {
    result.subscribe(() => this.onSaveSuccess());
  }

  protected onSaveSuccess(): void {
    this.editMode = false;
  }

  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.editMode = true;

      return true;
    } else {
      this.editMode = false;

      return false;
    }
    this.editMode = false;
    return false;
  }
}
