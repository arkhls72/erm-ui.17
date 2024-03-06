import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { ExerGroupService } from '../../service/exer-group.service';
import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from '../../../../config/input.constants';

@Component({
  selector: 'bc-add-group-general',
  templateUrl: './add-group-general.component.html',
})
export class AddGroupGeneralComponent implements OnInit {
  isSaving = false;
  isAddMode = false;
  exerciseGroup!: ExerGroup;
  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    description: [null, [Validators.minLength(1), Validators.maxLength(250)]],
    lastModifiedDate: [],
  });

  constructor(
    protected exerGroupService: ExerGroupService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exerGroup }) => {
      if (!exerGroup.id) {
        this.isAddMode = true;
        const today = dayjs().startOf('day');
        exerGroup.lastModifiedDate = today;
      }

      this.updateForm(exerGroup);
    });
  }

  updateForm(exerGroup: any): void {
    this.editForm.patchValue({
      id: exerGroup.id,
      name: exerGroup.name,
      description: exerGroup.description,
      lastModifiedDate: exerGroup.lastModifiedDate ? exerGroup.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
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
      (exerGroup.lastModifiedDate = this.editForm.get(['lastModifiedDate'])!.value
        ? dayjs(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
        : undefined);

    return exerGroup;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ExerGroup>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res.body),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(exerGroup?: ExerGroup | null): void {
    this.isSaving = false;
    this.isAddMode = false;
    if (exerGroup) {
      this.exerciseGroup = exerGroup;
      this.router.navigate(['/exer-group/' + this.exerciseGroup.id + '/view']);
    }
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
